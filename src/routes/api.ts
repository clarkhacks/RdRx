import { Env, CreateShortUrlRequest } from '../types';
import { saveUrlToDatabase, saveDeletionEntry } from '../utils/database';
import { generateShortcode } from '../utils/shortcode';
import { unauthorizedResponseIfNotAuthenticated } from '../middleware/auth';

/**
 * Handle API routes
 * - POST /upload - Handle file upload
 * - POST / - Handle URL or snippet creation
 * - POST /temp - Create temporary URL that expires in 2 days
 */
export async function handleApiRoutes(request: Request, env: Env): Promise<Response> {
	// Handle temporary URL creation (public endpoint, no auth required)
	if (request.url.endsWith('/temp')) {
		return handleCreateTempUrl(request, env);
	}

	// Check if the user is authenticated using the user property attached by the middleware
	const isAuthenticatedUser = request.user !== undefined && request.user !== null;

	// Return unauthorized response if not authenticated
	const unauthorizedResponse = unauthorizedResponseIfNotAuthenticated(isAuthenticatedUser);
	if (unauthorizedResponse) {
		console.log('Unauthorized POST request');
		return unauthorizedResponse;
	}

	// Get the user ID from the authenticated user
	const userId = request.user?.uid || null;

	// Handle file upload
	if (request.url.endsWith('/upload')) {
		return handleFileUpload(request, env, userId);
	}

	// Handle URL or snippet creation
	return handleCreateShortUrl(request, env, userId);
}

/**
 * Handle file upload
 */
async function handleFileUpload(request: Request, env: Env, userId: string | null = null): Promise<Response> {
	const formData = await request.formData();
	const files = formData.getAll('files') as File[];
	const customCode = formData.get('customCode') as string;
	const apiKey = formData.get('apiKey') as string;
	const deleteDate = formData.get('deleteAfter') as string;
	const deleteDateCheckbox = formData.has('deleteDate');

	console.log('Delete date checkbox:', deleteDateCheckbox);
	console.log('Delete date:', deleteDate);

	const urls = [];
	const shortcode = `f-${customCode}`;

	for (const file of files) {
		const key = `uploads/${customCode}-${file.name}`;
		await env.R2_RDRX.put(key, file.stream());
		console.log(`Uploaded file: ${key}`);

		// Handle delete date - only if both checkbox is checked AND a valid date is provided
		if (deleteDateCheckbox && deleteDate) {
			const deleteTimestamp = new Date(deleteDate).getTime();
			if (!isNaN(deleteTimestamp)) {
				console.log('Saving delete date to D1');
				// Save to D1 - for files, we need to pass true for isFile and remove the f- prefix
				await saveDeletionEntry(env, customCode, deleteTimestamp, true);
			} else {
				console.log('Invalid delete date format, skipping expiration');
			}
		}

		const url = `https://cdn.rdrx.co/${key}`;
		urls.push(url);
	}

	// Save to D1
	try {
		await saveUrlToDatabase(`f-${customCode}`, JSON.stringify(urls), env, userId);
	} catch (error) {
		console.error('Error saving file URLs to D1:', error);
		throw error;
	}

	return new Response(JSON.stringify({ urls, shortcode }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

/**
 * Handle create temporary short URL that expires in 2 days
 * This is a public endpoint that doesn't require authentication
 * Stores URLs in KV instead of D1 to limit costs
 */
async function handleCreateTempUrl(request: Request, env: Env): Promise<Response> {
	try {
		const body = (await request.json()) as { url?: string };
		if (typeof body !== 'object' || body === null) {
			return new Response('Invalid request body', { status: 400 });
		}

		const { url } = body;

		// Validate URL
		if (!url) {
			console.log('Bad Request: Missing or invalid URL');
			return new Response('Bad Request: Missing or invalid URL', {
				status: 400,
			});
		}

		// Generate random shortcode
		const shortcode = generateShortcode();

		// Check if shortcode already exists in KV
		const existingUrl = await env.KV_RDRX.get(`short:${shortcode}`);
		if (existingUrl) {
			console.log('Shortcode already exists in KV, generating a new one');
			// Try again with a new shortcode
			return handleCreateTempUrl(request, env);
		}

		// Calculate expiration date (2 days from now)
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 2);
		const expirationTimestamp = expirationDate.getTime();

		// Save the URL to KV with the format short:shortcode -> url
		await env.KV_RDRX.put(`short:${shortcode}`, url);

		// Save the expiration date to KV with the format delete-short:shortcode -> timestamp
		await env.KV_RDRX.put(`delete-short:${shortcode}`, expirationTimestamp.toString());

		console.log('Temporary URL created with expiration in 2 days (stored in KV)');
		return new Response(
			JSON.stringify({
				shortcode,
				url,
				expires_at: expirationDate.toISOString(),
				full_url: `https://rdrx.co/${shortcode}`,
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			}
		);
	} catch (error) {
		console.error('Error handling temporary URL creation:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}

/**
 * Handle create short URL
 */
async function handleCreateShortUrl(request: Request, env: Env, userId: string | null): Promise<Response> {
	try {
		const body = await request.json();
		if (typeof body !== 'object' || body === null) {
			return new Response('Invalid request body', { status: 400 });
		}

		const { url, custom, custom_code, admin_override_code, delete_after, snippet, userId: frontendUserId } = body as CreateShortUrlRequest;

		// Use userId from the request body if provided, otherwise use the one from authentication
		const creatorId = frontendUserId || userId;

		// Check for admin override
		if (admin_override_code && env.API_KEY_ADMIN === admin_override_code) {
			return handleAdminOverride(url, custom_code, delete_after, env, creatorId);
		}

		// Validate URL
		if (!url && !snippet) {
			console.log('Bad Request: Missing or invalid URL');
			return new Response('Bad Request: Missing or invalid URL', {
				status: 400,
			});
		}

		// Generate shortcode if not provided
		const shortcode = custom && custom_code ? custom_code : generateShortcode();

		// Check if shortcode already exists
		const existingUrl = await checkShortcodeExists(shortcode, env);
		if (existingUrl) {
			console.log('Shortcode already exists');
			return new Response(JSON.stringify({ message: 'Shortcode already exists' }), { status: 409 });
		}

		// Save the URL to D1
		if (snippet) {
			await saveUrlToDatabase(`c-${shortcode}`, snippet, env, creatorId);

			// Add delete key if delete_after is provided for snippets
			if (delete_after) {
				await handleDeleteAfter(`c-${shortcode}`, delete_after, env);
			}
		} else if (url) {
			await saveUrlToDatabase(shortcode, url, env, creatorId);

			// Add delete key if delete_after is provided for URLs
			if (delete_after) {
				await handleDeleteAfter(shortcode, delete_after, env);
			}
		} else {
			// This should never happen due to earlier validation, but added for type safety
			return new Response('Missing URL or snippet', { status: 400 });
		}

		console.log('Short URL created');
		return new Response(JSON.stringify({ shortcode }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error handling POST request:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}

/**
 * Handle admin override
 */
async function handleAdminOverride(
	url: string | undefined,
	custom_code: string | undefined,
	delete_after: string | undefined,
	env: Env,
	creatorId: string | null
): Promise<Response> {
	if (!custom_code || !url) {
		return new Response('Missing custom code or URL', { status: 400 });
	}

	// url is guaranteed to be a string at this point
	await saveUrlToDatabase(custom_code, url, env, creatorId);

	// Add delete entry if delete_after is provided
	if (delete_after) {
		await handleDeleteAfter(custom_code, delete_after, env);
	}

	console.log('Short URL overwritten');
	return new Response(JSON.stringify({ message: 'Short URL overwritten', shortcode: custom_code }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

/**
 * Handle delete after date
 */
async function handleDeleteAfter(shortcode: string, delete_after: string, env: Env): Promise<void> {
	console.log('Delete after date:', delete_after);
	const deleteTimestamp = new Date(delete_after).getTime();
	if (!isNaN(deleteTimestamp)) {
		console.log('Saving delete_after date to D1');
		await saveDeletionEntry(env, shortcode, deleteTimestamp, false);
	} else {
		console.log('Invalid delete_after date');
		throw new Error('Invalid delete_after date');
	}
}

/**
 * Check if a shortcode already exists
 */
async function checkShortcodeExists(shortcode: string, env: Env): Promise<string | null> {
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();
		if (result && typeof result === 'object' && 'target_url' in result) {
			return result.target_url as string;
		}
		return null;
	} catch (error) {
		console.error('Error checking if shortcode exists in D1:', error);
		return null;
	}
}
