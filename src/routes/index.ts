import { Env } from '../types';
import { getShortcodeFromRequest } from '../utils/shortcode';
import { handleAnalyticsRoutes } from './analytics';
import { handleCustomAuthRoutes } from './customAuth';
import { handleShortcodeRoutes } from './shortcode';
import { handleApiRoutes } from './api';
import { renderLandingPage } from '../components/pages/LandingPage';
import { renderAccountPage } from '../components/pages/AccountPage';
import { authMiddleware } from '../middleware/auth';

/**
 * Main router that delegates to specific route handlers based on the request
 */
export async function router(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const shortcode = getShortcodeFromRequest(request);

	// Apply authentication middleware to all requests
	// This will verify the session and attach the user to the request
	const { request: enhancedRequest, isAuthenticated, user } = await authMiddleware(request, env);

	// Handle authentication routes first
	const authResponse = await handleCustomAuthRoutes(enhancedRequest, env);
	if (authResponse) {
		return authResponse;
	}

	// Handle analytics routes
	if (url.pathname === '/analytics' || url.pathname.startsWith('/analytics/')) {
		return handleAnalyticsRoutes(enhancedRequest, env, url.pathname);
	}

	// Handle account page
	if (url.pathname === '/account') {
		return renderAccountPage(enhancedRequest, env);
	}

	// Handle API routes for POST requests
	if (request.method === 'POST') {
		return handleApiRoutes(enhancedRequest, env);
	}

	// Handle home page (no shortcode)
	if (!shortcode) {
		return renderLandingPage();
	}

	// Handle all shortcode routes (including protected paths)
	return handleShortcodeRoutes(enhancedRequest, env, shortcode);
}
