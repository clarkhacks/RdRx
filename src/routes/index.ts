import { Env } from '../types';
import { getShortcodeFromRequest } from '../utils/shortcode';
import { handleAnalyticsRoutes } from './analytics';
import { handleAuthRoutes } from './auth';
import { handleShortcodeRoutes } from './shortcode';
import { handleApiRoutes } from './api';
import { renderLandingPage } from '../components/pages/LandingPage';

/**
 * Main router that delegates to specific route handlers based on the request
 */
export async function router(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const shortcode = getShortcodeFromRequest(request);

	// Handle static CSS files
	if (url.pathname.startsWith('/css/')) {
		// Extract the file name from the path
		const fileName = url.pathname.split('/').pop() || '';

		// Create a new request to the static file
		const staticRequest = new Request(`${url.origin}/static/css/${fileName}`, request);

		// Try to serve the static file using Cloudflare's static asset handling
		try {
			// If the project is set up as a Workers Site, this will work
			// @ts-ignore - __STATIC_CONTENT is a special namespace provided by Cloudflare Workers Sites
			if (typeof __STATIC_CONTENT !== 'undefined') {
				// @ts-ignore
				const staticResponse = await __STATIC_CONTENT.fetch(staticRequest);
				if (staticResponse.status === 200) {
					// Add caching headers
					const response = new Response(staticResponse.body, staticResponse);
					response.headers.set('Content-Type', 'text/css');
					response.headers.set('Cache-Control', 'public, max-age=86400');
					return response;
				}
			}

			// Fallback to serving from R2 if available
			if (env.R2_RDRX) {
				const file = await env.R2_RDRX.get(`css/${fileName}`);
				if (file) {
					return new Response(file.body, {
						headers: {
							'Content-Type': 'text/css',
							'Cache-Control': 'public, max-age=86400',
						},
					});
				}
			}

			// If we get here, the file wasn't found
			return new Response('CSS file not found', { status: 404 });
		} catch (error) {
			// If there's an error, return a 500
			return new Response('Error serving CSS file', { status: 500 });
		}
	}

	// Handle analytics routes
	if (url.pathname === '/analytics' || url.pathname.startsWith('/analytics/')) {
		return handleAnalyticsRoutes(request, env, url.pathname);
	}

	// Handle authentication routes
	if (url.pathname === '/login' || url.pathname === '/verify') {
		return handleAuthRoutes(request, env, url.pathname);
	}

	// Handle API routes for POST requests
	if (request.method === 'POST') {
		return handleApiRoutes(request, env);
	}

	// Handle home page (no shortcode)
	if (!shortcode) {
		return renderLandingPage();
	}

	// Handle all shortcode routes (including protected paths)
	return handleShortcodeRoutes(request, env, shortcode);
}
