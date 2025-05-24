import { Env } from '../types';
import { getShortcodeFromRequest } from '../utils/shortcode';
import { handleAnalyticsRoutes } from './analytics';
import { handleCustomAuthRoutes } from './customAuth';
import { handleShortcodeRoutes } from './shortcode';
import { handleApiRoutes } from './api';
import { handleAdminRoutes } from './admin';
import { handleUserRoutes } from './user';
import { renderAccountPage } from '../components/pages/AccountPage';
import { renderDashboardPage } from '../components/pages/DashboardPage';
import { renderAdminPage } from '../components/pages/AdminPage';
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

	// Handle admin API routes
	if (url.pathname.startsWith('/api/admin/')) {
		const adminResponse = await handleAdminRoutes(enhancedRequest, env);
		if (adminResponse) {
			return adminResponse;
		}
	}

	// Handle user API routes
	if (url.pathname.startsWith('/api/user/')) {
		const userResponse = await handleUserRoutes(enhancedRequest, env);
		if (userResponse) {
			return userResponse;
		}
	}

	// Handle analytics routes
	if (url.pathname === '/analytics' || url.pathname.startsWith('/analytics/')) {
		return handleAnalyticsRoutes(enhancedRequest, env, url.pathname);
	}

	// Handle account page
	if (url.pathname === '/account') {
		return renderAccountPage(enhancedRequest, env);
	}

	// Handle dashboard page
	if (url.pathname === '/dashboard') {
		return renderDashboardPage(enhancedRequest, env);
	}

	// Handle admin page
	if (url.pathname === '/admin') {
		return renderAdminPage(enhancedRequest, env);
	}

	// Handle API routes for POST requests
	if (request.method === 'POST') {
		return handleApiRoutes(enhancedRequest, env);
	}

	// Static files (landing page, terms, privacy, verify) are now served from /static directory
	// Landing page (/), terms (/terms/), privacy (/privacy/), and verify (/verify/)
	// are handled by Cloudflare Workers static asset serving

	// If no shortcode is present and we reach here, it means the static file wasn't found
	// This could be a request for the root path or other static paths
	if (!shortcode) {
		// Let static assets be served by the Workers runtime
		// If the static file doesn't exist, this will eventually return a 404
		return new Response('Not Found', { status: 404 });
	}

	// Handle all shortcode routes (including protected paths)
	return handleShortcodeRoutes(enhancedRequest, env, shortcode);
}
