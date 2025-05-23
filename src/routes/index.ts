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
