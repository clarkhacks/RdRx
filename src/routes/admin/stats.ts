import { Env } from '../../types';

/**
 * Get system statistics
 */
export async function handleGetStats(request: Request, env: Env): Promise<Response> {
	try {
		const [usersResult, urlsResult] = await Promise.all([
			env.DB.prepare('SELECT COUNT(*) as total FROM users').first(),
			env.DB.prepare('SELECT COUNT(*) as total FROM short_urls').first(),
		]);

		return new Response(
			JSON.stringify({
				success: true,
				stats: {
					totalUsers: usersResult?.total || 0,
					totalUrls: urlsResult?.total || 0,
				},
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (error) {
		console.error('Error getting stats:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Get detailed analytics
 */
export async function handleGetAnalytics(request: Request, env: Env): Promise<Response> {
	try {
		const [usersResult, urlsResult, viewsResult] = await Promise.all([
			env.DB.prepare('SELECT COUNT(*) as total FROM users').first(),
			env.DB.prepare('SELECT COUNT(*) as total FROM short_urls').first(),
			env.DB.prepare('SELECT COUNT(*) as total FROM analytics').first(),
		]);

		// Calculate storage used (this is an approximation)
		let storageUsed = 0;
		try {
			const objects = await env.R2_RDRX.list();
			storageUsed = Math.round(objects.objects.reduce((total, obj) => total + (obj.size || 0), 0) / (1024 * 1024));
		} catch (r2Error) {
			console.error('Error calculating storage:', r2Error);
		}

		return new Response(
			JSON.stringify({
				success: true,
				analytics: {
					totalUsers: usersResult?.total || 0,
					totalUrls: urlsResult?.total || 0,
					totalViews: viewsResult?.total || 0,
					storageUsed,
				},
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (error) {
		console.error('Error getting analytics:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Check if user is admin
 */
export async function handleAdminCheck(request: Request, env: Env): Promise<Response> {
	// This function is only called if the user passed the admin check
	// So we can safely return that they are admin
	return new Response(JSON.stringify({ isAdmin: true }), {
		headers: { 'Content-Type': 'application/json' },
	});
}
