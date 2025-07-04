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
import { getBioPage } from '../utils/database';

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

	// Handle bio page - redirect to account page
	if (url.pathname === '/bio') {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/account',
			},
		});
	}

	// Handle bio edit page
	if (url.pathname === '/bio/edit') {
		const { handleBioEditorPage } = await import('./bio');
		return handleBioEditorPage(enhancedRequest, env);
	}

	// Handle bio API routes
	if (url.pathname.startsWith('/api/bio/')) {
		const { handleGetUserBio, handleSaveBio, handleOgImageUpload } = await import('./bio');
		if (url.pathname === '/api/bio/my-bio' && request.method === 'GET') {
			return handleGetUserBio(enhancedRequest, env);
		}
		if (url.pathname === '/api/bio/save' && request.method === 'POST') {
			return handleSaveBio(enhancedRequest, env);
		}
		if (url.pathname === '/api/bio/og-image' && request.method === 'POST') {
			return handleOgImageUpload(enhancedRequest, env);
		}
	}

	// Handle bio view routes (for viewing bio pages)
	if (url.pathname.startsWith('/bio-view/')) {
		const { handleViewBio } = await import('./bio');
		const bioShortcode = url.pathname.replace('/bio-view/', '');
		return handleViewBio(enhancedRequest, env, bioShortcode);
	}

	// Check if this shortcode is a bio page
	if (shortcode) {
		const bioPage = await getBioPage(env, shortcode);
		if (bioPage) {
			const { handleViewBio } = await import('./bio');
			return handleViewBio(enhancedRequest, env, shortcode);
		}
	}

	// Handle API routes for POST requests
	if (request.method === 'POST') {
		// Special case for the temporary URL endpoint which doesn't require auth
		if (url.pathname === '/api/temp') {
			return handleApiRoutes(request, env);
		}
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
