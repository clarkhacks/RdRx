import { Env } from '../types';
import { renderAnalyticsPage } from '../components/pages/AnalyticsPage';
import { renderAnalyticsListPage } from '../components/pages/AnalyticsListPage';
import { isAuthenticated, getUserID } from '../utils/clerk';

/**
 * Handle analytics routes
 * - /analytics - List analytics for all shortcodes
 * - /analytics/:shortcode - Show analytics for a specific shortcode
 */
export async function handleAnalyticsRoutes(request: Request, env: Env, path: string): Promise<Response> {
	// Check if the user is authenticated
	const isAuthenticatedUser = await isAuthenticated(request, env);
	if (!isAuthenticatedUser) {
		return redirectToLogin();
	}

	// Handle analytics list page
	if (path === '/analytics') {
		const userId = await getUserID(request, env);
		if (!userId) {
			return new Response('Unauthorized', { status: 403 });
		}
		return renderAnalyticsListPage(env, userId, request);
	}

	// Handle analytics detail page
	if (path.startsWith('/analytics/')) {
		const analyticsCode = path.replace('/analytics/', '');
		if (!analyticsCode) {
			return new Response('Not Found', { status: 404 });
		}
		return renderAnalyticsPage(analyticsCode, env);
	}

	// Fallback for unknown analytics routes
	return new Response('Not Found', { status: 404 });
}

/**
 * Redirect to login page
 */
function redirectToLogin(): Response {
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/login',
		},
	});
}
