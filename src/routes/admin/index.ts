import { Env } from '../../types';
import { handleGetUsers, handleCreateUser, handleToggleUserVerification, handleDeleteUser } from './users';
import { handleGetUrls, handleUpdateUrl, handleDeleteUrl } from './urls';
import { handleAdminCheck, handleGetStats, handleGetAnalytics } from './stats';
import { handleGetEmailConfig, handleTestEmail } from './email';

/**
 * Handle admin API routes
 */
export async function handleAdminRoutes(request: Request, env: Env): Promise<Response | null> {
	const url = new URL(request.url);

	// Check if user is authenticated and is admin
	if (!request.user || request.user.uid !== env.ADMIN_UID) {
		return new Response(JSON.stringify({ success: false, message: 'Forbidden' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Handle different admin API endpoints
	if (url.pathname.startsWith('/api/admin/')) {
		const path = url.pathname.replace('/api/admin/', '');

		switch (true) {
			case path === 'check' && request.method === 'GET':
				return handleAdminCheck(request, env);
			case path === 'users' && request.method === 'GET':
				return handleGetUsers(request, env);
			case path === 'users' && request.method === 'POST':
				return handleCreateUser(request, env);
			case path.startsWith('users/') && path.endsWith('/verify') && request.method === 'POST':
				return handleToggleUserVerification(request, env, path);
			case path.startsWith('users/') && request.method === 'DELETE':
				return handleDeleteUser(request, env, path);
			case path === 'urls' && request.method === 'GET':
				return handleGetUrls(request, env);
			case path.startsWith('urls/') && request.method === 'PUT':
				return handleUpdateUrl(request, env, path);
			case path.startsWith('urls/') && request.method === 'DELETE':
				return handleDeleteUrl(request, env, path);
			case path === 'stats' && request.method === 'GET':
				return handleGetStats(request, env);
			case path === 'analytics' && request.method === 'GET':
				return handleGetAnalytics(request, env);
			case path === 'email-config' && request.method === 'GET':
				return handleGetEmailConfig(request, env);
			case path.startsWith('test-email/') && request.method === 'POST':
				return handleTestEmail(request, env, path);
			default:
				return new Response(JSON.stringify({ success: false, message: 'Not found' }), {
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				});
		}
	}

	return null;
}
