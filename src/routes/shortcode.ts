import { Env } from '../types';
import { renderCreateFormPage as renderCreateForm } from '../components/pages/CreateFormPage';
import { renderSnippetFormPage as renderSnippetForm } from '../components/pages/SnippetFormPage';
import { renderUploadFormPage as renderUploadForm } from '../components/pages/UploadFormPage';
import { renderViewFiles } from '../components/viewFiles';
import { fetchUrlByShortcode, trackView, isShortcodePasswordProtected, verifyShortcodePassword } from '../utils/database';
import { isSnippetShortcode, isFileShortcode, getContentTypeForExtension } from '../utils/shortcode';
import { redirectToLoginIfNotAuthenticated } from '../middleware/auth';

/**
 * Handle shortcode routes
 * - Protected paths (create, snippet, upload)
 * - Snippet shortcodes
 * - File shortcodes
 * - Shortcode redirects
 */
export async function handleShortcodeRoutes(request: Request, env: Env, shortcode: string): Promise<Response> {
	const url = new URL(request.url);
	const searchParams = url.searchParams;

	// Handle protected paths
	if (['create', 'snippet', 'upload'].includes(shortcode)) {
		return handleProtectedPath(request, env, shortcode);
	}

	// Handle snippet shortcode
	if (isSnippetShortcode(shortcode)) {
		return handleSnippetRequest(request, shortcode, env);
	}

	// Handle file shortcode
	if (isFileShortcode(shortcode)) {
		return handleFileRequest(request, shortcode, env);
	}

	// Handle data parameter
	if (searchParams.get('data') === '1') {
		const redirectUrl = await fetchUrlByShortcode(shortcode, env);
		return new Response(redirectUrl, {
			headers: { 'Content-Type': 'text/plain' },
		});
	}

	// Handle edit parameter
	if (searchParams.get('edit') === '1') {
		const redirectUrl = await fetchUrlByShortcode(shortcode, env);
		// Convert null to undefined for renderCreateForm
		return renderCreateForm(request, env, redirectUrl || undefined, shortcode);
	}

	// Handle regular shortcode redirect
	return handleShortcodeRedirect(request, shortcode, env);
}

/**
 * Handle protected paths that require authentication
 */
async function handleProtectedPath(request: Request, env: Env, shortcode: string): Promise<Response> {
	const isAuthenticatedUser = request.user !== undefined && request.user !== null;

	if (!isAuthenticatedUser) {
		console.log('Unauthorized access attempt to:', shortcode);
		// get current URL and append it to the login redirect
		const url = new URL(request.url);
		const redirectResponse = redirectToLoginIfNotAuthenticated(isAuthenticatedUser, url.href);
		if (redirectResponse) {
			return redirectResponse;
		}
	}

	switch (shortcode) {
		case 'create':
			return renderCreateForm(request, env);
		case 'snippet':
			return renderSnippetForm(env);
		case 'upload':
			return renderUploadForm(env);
		default:
			return new Response('Not Found', { status: 404 });
	}
}

/**
 * Handle snippet request
 */
async function handleSnippetRequest(request: Request, shortcode: string, env: Env): Promise<Response> {
	const lookUp = shortcode.replace('c-', '').split('.');

	// Try to get from D1
	let codeSnippet = null;
	let targetUrl = null;
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(lookUp[0]).first();

		if (result && typeof result === 'object' && 'target_url' in result) {
			codeSnippet = result.target_url as string;
			targetUrl = codeSnippet;
		}
	} catch (error) {
		console.error('Error fetching snippet from D1:', error);
	}

	if (!codeSnippet) {
		console.log('Code snippet not found');
		return new Response('Not Found', { status: 404 });
	}

	// Track the view in D1
	if (targetUrl) {
		try {
			await trackView(request, env, lookUp[0], targetUrl);
			console.log(`View tracked for snippet shortcode: ${lookUp[0]}`);
		} catch (error) {
			console.error('Error tracking view for snippet:', error);
			// Continue even if tracking fails
		}
	}

	const extension = lookUp[1] || 'txt';
	const contentType = getContentTypeForExtension(extension);

	return new Response(codeSnippet, {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': `inline; filename="snippet.${extension}"`,
		},
	});
}

/**
 * Handle file request
 */
async function handleFileRequest(request: Request, shortcode: string, env: Env): Promise<Response> {
	// Try to get from D1
	let fileUrls = null;
	let targetUrl = null;
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

		if (result && typeof result === 'object' && 'target_url' in result) {
			targetUrl = result.target_url as string;
			try {
				fileUrls = JSON.parse(targetUrl);
			} catch (error) {
				console.error('Error parsing JSON from D1:', error);
			}
		}
	} catch (error) {
		console.error('Error fetching file URLs from D1:', error);
	}

	if (!fileUrls) {
		console.log('Files not found');
		return new Response('Not Found', { status: 404 });
	}

	// Track the view in D1
	if (targetUrl) {
		try {
			await trackView(request, env, shortcode, targetUrl);
			console.log(`View tracked for file shortcode: ${shortcode}`);
		} catch (error) {
			console.error('Error tracking view for file:', error);
			// Continue even if tracking fails
		}
	}

	if (Array.isArray(fileUrls)) {
		return renderViewFiles(fileUrls, shortcode);
	} else {
		console.error('Stored file URLs is not an array');
		return new Response('Internal Server Error', { status: 500 });
	}
}

/**
 * Handle shortcode redirect
 */
async function handleShortcodeRedirect(request: Request, shortcode: string, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const searchParams = url.searchParams;

	// First check if this is a temporary URL stored in KV
	const kvUrl = await env.KV_RDRX.get(`short:${shortcode}`);

	if (kvUrl) {
		console.log('Found URL in KV:', shortcode);
		// No need to track views for temporary URLs to save costs
		return Response.redirect(kvUrl);
	}

	// Check if the shortcode is password protected
	const isPasswordProtected = await isShortcodePasswordProtected(shortcode, env);

	if (isPasswordProtected) {
		// Check if a password was provided in the URL
		const providedPassword = searchParams.get('password');

		if (!providedPassword) {
			// No password provided, show password prompt
			return renderPasswordPrompt(shortcode);
		}

		// Verify the password
		const isPasswordValid = await verifyShortcodePassword(shortcode, providedPassword, env);

		if (!isPasswordValid) {
			// Invalid password, show error
			return renderPasswordPrompt(shortcode, true);
		}

		// Password is valid, continue with redirect
	}

	// If not in KV, try to get from D1
	const redirectUrl = await fetchUrlByShortcode(shortcode, env);

	// Check if this might be a snippet without the c- prefix
	if (!redirectUrl) {
		return handlePossibleSnippetWithoutPrefix(shortcode, env);
	}

	// Track the view in D1
	await trackView(request, env, shortcode, redirectUrl);

	// Redirect to the found URL
	return Response.redirect(redirectUrl);
}

/**
 * Render password prompt page
 */
function renderPasswordPrompt(shortcode: string, isError: boolean = false): Response {
	return new Response(
		`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="noindex, nofollow">
        <title>Password Protected - RdRx</title>
        <link rel="stylesheet" href="/assets/built.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <i class="fas fa-lock text-primary-600 text-2xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-800">Password Protected</h1>
                <p class="text-gray-600 mt-2">This content is protected. Please enter the password to continue.</p>
            </div>
            
            ${
							isError
								? `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>Incorrect password. Please try again.</p>
            </div>`
								: ''
						}
            
            <form method="GET" action="/${shortcode}">
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" id="password" name="password" required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                </div>
                
                <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300">
                    Continue
                </button>
            </form>
            
            <div class="mt-6 text-center">
                <a href="/" class="text-primary-600 hover:text-primary-800 text-sm">Return to Home</a>
            </div>
        </div>
    </body>
    </html>`,
		{
			headers: { 'Content-Type': 'text/html' },
		}
	);
}

/**
 * Handle possible snippet without c- prefix
 */
async function handlePossibleSnippetWithoutPrefix(shortcode: string, env: Env): Promise<Response> {
	// Try to find a snippet with c- prefix in D1
	let snippetContent = null;
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(`c-${shortcode}`).first();

		if (result && typeof result === 'object' && 'target_url' in result) {
			snippetContent = result.target_url as string;
		}
	} catch (error) {
		console.error('Error fetching snippet from D1:', error);
	}

	if (snippetContent) {
		// If found, handle it as a code snippet
		const extension = 'txt'; // Default extension
		return new Response(snippetContent, {
			headers: {
				'Content-Type': 'text/plain',
				'Content-Disposition': `inline; filename="snippet.${extension}"`,
			},
		});
	}

	console.log('Shortcode not found');
	return renderNotFoundPage();
}

/**
 * Render not found page
 */
function renderNotFoundPage(): Response {
	return new Response(
		`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="noindex, nofollow">
        <title>RDRX Short URLs</title>
        <link rel="stylesheet" href="/assets/built.css" />
        </head>
        <body class="bg-gray-100 min-h-screen flex items-center justify-center">
            <div class="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-md flex items-center justify-center">
                <h1 class="text-2xl font-bold text-red-600 text-center">404: The link you're looking for doesn't exist.</h1>
            </div>
        </body>
        </html>`,
		{
			headers: { 'Content-Type': 'text/html' },
			status: 404,
		}
	);
}
