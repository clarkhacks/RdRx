import { Env } from '../types';
import { renderCreateFormPage as renderCreateForm } from '../components/pages/CreateFormPage';
import { renderSnippetFormPage as renderSnippetForm } from '../components/pages/SnippetFormPage';
import { renderUploadFormPage as renderUploadForm } from '../components/pages/UploadFormPage';
import { renderViewFiles } from '../components/viewFiles';
import { isAuthenticated } from '../utils/auth';
import { fetchUrlByShortcode, trackView } from '../utils/database';
import { isSnippetShortcode, isFileShortcode, getContentTypeForExtension } from '../utils/shortcode';

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
		return handleSnippetRequest(shortcode, env);
	}

	// Handle file shortcode
	if (isFileShortcode(shortcode)) {
		return handleFileRequest(shortcode, env);
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
		return renderCreateForm(env, redirectUrl || undefined, shortcode);
	}

	// Handle regular shortcode redirect
	return handleShortcodeRedirect(request, shortcode, env);
}

/**
 * Handle protected paths that require authentication
 */
async function handleProtectedPath(request: Request, env: Env, shortcode: string): Promise<Response> {
	const isAuthenticatedUser = await isAuthenticated(request, env);
	if (!isAuthenticatedUser) {
		console.log('Unauthorized access attempt to:', shortcode);
		// get current URL and append it to the login redirect
		const url = new URL(request.url);
		const redirectUrl = `${url.origin}${url.pathname}?redirect_url=${encodeURIComponent(url.href)}`;
		return redirectToLogin(redirectUrl, env);
	}

	switch (shortcode) {
		case 'create':
			return renderCreateForm(env);
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
async function handleSnippetRequest(shortcode: string, env: Env): Promise<Response> {
	const lookUp = shortcode.replace('c-', '').split('.');

	// Try to get from D1
	let codeSnippet = null;
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(lookUp[0]).first();

		if (result && typeof result === 'object' && 'target_url' in result) {
			codeSnippet = result.target_url as string;
		}
	} catch (error) {
		console.error('Error fetching snippet from D1:', error);
	}

	if (!codeSnippet) {
		console.log('Code snippet not found');
		return new Response('Not Found', { status: 404 });
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
async function handleFileRequest(shortcode: string, env: Env): Promise<Response> {
	// Try to get from D1
	let fileUrls = null;
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

		if (result && typeof result === 'object' && 'target_url' in result) {
			try {
				fileUrls = JSON.parse(result.target_url as string);
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
 * Redirect to login page
 */
function redirectToLogin(redirectUrl: string, string: any): Response {
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/login?redirect_url=' + encodeURIComponent(redirectUrl),
		},
	});
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
        <script src="https://cdn.tailwindcss.com"></script>
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
