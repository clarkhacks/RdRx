import { Env } from '../types';
import { renderAnalyticsPage } from '../components/pages/AnalyticsPage';
import { renderAnalyticsListPage } from '../components/pages/AnalyticsListPage';
import { redirectToLoginIfNotAuthenticated } from '../middleware/auth';

/**
 * Handle analytics routes
 * - /analytics - List analytics for all shortcodes
 * - /analytics/:shortcode - Show analytics for a specific shortcode
 */
export async function handleAnalyticsRoutes(request: Request, env: Env, path: string): Promise<Response> {
	// Check if the user is authenticated using the user property attached by the middleware
	const isAuthenticatedUser = request.user !== undefined && request.user !== null;

	// Redirect to login if not authenticated
	const redirectResponse = redirectToLoginIfNotAuthenticated(isAuthenticatedUser, request.url);
	if (redirectResponse) {
		return redirectResponse;
	}

	// Handle analytics list page
	if (path === '/analytics') {
		const userId = request.user?.uid;
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
