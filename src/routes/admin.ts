import { Env } from '../types';

/**
 * Handle admin API routes
 */
export async function handleAdminRoutes(request: Request, env: Env): Promise<Response | null> {
	const url = new URL(request.url);
	
	// Check if user is authenticated and is admin
	if (!request.user || request.user.uid !== env.ADMIN_UID) {
		return new Response(JSON.stringify({ success: false, message: 'Forbidden' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' }
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
			default:
				return new Response(JSON.stringify({ success: false, message: 'Not found' }), {
					status: 404,
					headers: { 'Content-Type': 'application/json' }
				});
		}
	}

	return null;
}

/**
 * Check if user is admin
 */
async function handleAdminCheck(request: Request, env: Env): Promise<Response> {
	// This function is only called if the user passed the admin check above
	// So we can safely return that they are admin
	return new Response(JSON.stringify({ isAdmin: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
}

/**
 * Get users with pagination and filtering
 */
async function handleGetUsers(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const search = url.searchParams.get('search') || '';
		const filter = url.searchParams.get('filter') || '';
		
		const offset = (page - 1) * limit;
		
		// Build query based on filters
		let query = 'SELECT uid, name, email, email_verified, profile_picture_url, created_at FROM users';
		let countQuery = 'SELECT COUNT(*) as total FROM users';
		const params: any[] = [];
		const countParams: any[] = [];
		
		let whereClause = '';
		if (search) {
			whereClause = ' WHERE (name LIKE ? OR email LIKE ?)';
			params.push(`%${search}%`, `%${search}%`);
			countParams.push(`%${search}%`, `%${search}%`);
		}
		
		if (filter === 'verified') {
			whereClause += whereClause ? ' AND email_verified = 1' : ' WHERE email_verified = 1';
		} else if (filter === 'unverified') {
			whereClause += whereClause ? ' AND email_verified = 0' : ' WHERE email_verified = 0';
		}
		
		query += whereClause + ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
		countQuery += whereClause;
		
		params.push(limit, offset);
		
		const [usersResult, countResult] = await Promise.all([
			env.DB.prepare(query).bind(...params).all(),
			env.DB.prepare(countQuery).bind(...countParams).first()
		]);
		
		const total = (countResult?.total as number) || 0;
		const totalPages = Math.ceil(total / limit);
		
		return new Response(JSON.stringify({
			success: true,
			users: usersResult.results,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				showing: usersResult.results?.length || 0
			}
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error getting users:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Create a new user
 */
async function handleCreateUser(request: Request, env: Env): Promise<Response> {
	try {
		const body = await request.json() as { name: string; email: string; password: string; email_verified: boolean };
		const { name, email, password, email_verified } = body;
		
		// Hash password
		const passwordHash = await hashPassword(password);
		const uid = crypto.randomUUID();
		
		await env.DB.prepare(`
			INSERT INTO users (uid, name, email, password_hash, email_verified, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
		`).bind(uid, name, email, passwordHash, email_verified ? 1 : 0).run();
		
		return new Response(JSON.stringify({ success: true, message: 'User created successfully' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error creating user:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to create user' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Toggle user email verification status
 */
async function handleToggleUserVerification(request: Request, env: Env, path: string): Promise<Response> {
	try {
		const userId = path.split('/')[1];
		const body = await request.json() as { verified: boolean };
		const { verified } = body;
		
		await env.DB.prepare(`
			UPDATE users SET email_verified = ?, updated_at = datetime('now')
			WHERE uid = ?
		`).bind(verified ? 1 : 0, userId).run();
		
		return new Response(JSON.stringify({ success: true, message: 'User verification status updated' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error updating user verification:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to update verification status' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Delete a user and all their data
 */
async function handleDeleteUser(request: Request, env: Env, path: string): Promise<Response> {
	try {
		const userId = path.split('/')[1];
		
		// Get user's profile picture to delete from R2
		const user = await env.DB.prepare('SELECT profile_picture_url FROM users WHERE uid = ?').bind(userId).first();
		
		// Delete user's profile picture from R2 if exists
		if (user?.profile_picture_url && (user.profile_picture_url as string).includes(env.R2_URL)) {
			try {
				const key = (user.profile_picture_url as string).split('/').pop();
				if (key) {
					await env.R2_RDRX.delete(`profile-pictures/${key}`);
				}
			} catch (r2Error) {
				console.error('Error deleting profile picture from R2:', r2Error);
			}
		}
		
		// Get all user's shortcodes to delete files from R2
		const userShortcodes = await env.DB.prepare('SELECT shortcode FROM short_urls WHERE creator_id = ?').bind(userId).all();
		
		// Delete files from R2 for each shortcode
		for (const row of userShortcodes.results || []) {
			try {
				const objects = await env.R2_RDRX.list({ prefix: `files/${row.shortcode}/` });
				for (const object of objects.objects) {
					await env.R2_RDRX.delete(object.key);
				}
			} catch (r2Error) {
				console.error(`Error deleting files for shortcode ${row.shortcode}:`, r2Error);
			}
		}
		
		// Delete user's data from database (cascading deletes should handle related records)
		await env.DB.prepare('DELETE FROM users WHERE uid = ?').bind(userId).run();
		await env.DB.prepare('DELETE FROM short_urls WHERE creator_id = ?').bind(userId).run();
		await env.DB.prepare('DELETE FROM deletions WHERE shortcode IN (SELECT shortcode FROM short_urls WHERE creator_id = ?)').bind(userId).run();
		
		return new Response(JSON.stringify({ success: true, message: 'User and all associated data deleted successfully' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error deleting user:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to delete user' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Get URLs with pagination and filtering
 */
async function handleGetUrls(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const search = url.searchParams.get('search') || '';
		const filter = url.searchParams.get('filter') || '';
		
		const offset = (page - 1) * limit;
		
		// Build query based on filters
		let query = `
			SELECT s.shortcode, s.target_url as url, s.created_at, u.name as user_name,
			CASE 
				WHEN s.is_snippet = 1 THEN 'snippet'
				WHEN s.is_file = 1 THEN 'file'
				ELSE 'url'
			END as type
			FROM short_urls s
			LEFT JOIN users u ON s.creator_id = u.uid
		`;
		let countQuery = 'SELECT COUNT(*) as total FROM short_urls s LEFT JOIN users u ON s.creator_id = u.uid';
		const params: any[] = [];
		const countParams: any[] = [];
		
		let whereClause = '';
		if (search) {
			whereClause = ' WHERE (s.shortcode LIKE ? OR s.target_url LIKE ? OR u.name LIKE ?)';
			params.push(`%${search}%`, `%${search}%`, `%${search}%`);
			countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
		}
		
		if (filter === 'url') {
			whereClause += whereClause ? ' AND s.is_snippet = 0 AND s.is_file = 0' : ' WHERE s.is_snippet = 0 AND s.is_file = 0';
		} else if (filter === 'snippet') {
			whereClause += whereClause ? ' AND s.is_snippet = 1' : ' WHERE s.is_snippet = 1';
		} else if (filter === 'file') {
			whereClause += whereClause ? ' AND s.is_file = 1' : ' WHERE s.is_file = 1';
		}
		
		query += whereClause + ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
		countQuery += whereClause;
		
		params.push(limit, offset);
		
		const [urlsResult, countResult] = await Promise.all([
			env.DB.prepare(query).bind(...params).all(),
			env.DB.prepare(countQuery).bind(...countParams).first()
		]);
		
		const total = (countResult?.total as number) || 0;
		const totalPages = Math.ceil(total / limit);
		
		return new Response(JSON.stringify({
			success: true,
			urls: urlsResult.results,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				showing: urlsResult.results?.length || 0
			}
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error getting URLs:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Update a URL
 */
async function handleUpdateUrl(request: Request, env: Env, path: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		const body = await request.json() as { url: string };
		const { url } = body;
		
		await env.DB.prepare(`
			UPDATE short_urls SET target_url = ?
			WHERE shortcode = ?
		`).bind(url, shortcode).run();
		
		return new Response(JSON.stringify({ success: true, message: 'URL updated successfully' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error updating URL:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to update URL' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Delete a URL and associated files
 */
async function handleDeleteUrl(request: Request, env: Env, path: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		
		// Delete files from R2 if it's a file shortcode
		try {
			const objects = await env.R2_RDRX.list({ prefix: `files/${shortcode}/` });
			for (const object of objects.objects) {
				await env.R2_RDRX.delete(object.key);
			}
		} catch (r2Error) {
			console.error(`Error deleting files for shortcode ${shortcode}:`, r2Error);
		}
		
		// Delete from database
		await env.DB.prepare('DELETE FROM short_urls WHERE shortcode = ?').bind(shortcode).run();
		await env.DB.prepare('DELETE FROM deletions WHERE shortcode = ?').bind(shortcode).run();
		
		return new Response(JSON.stringify({ success: true, message: 'URL deleted successfully' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error deleting URL:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to delete URL' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Get system statistics
 */
async function handleGetStats(request: Request, env: Env): Promise<Response> {
	try {
		const [usersResult, urlsResult] = await Promise.all([
			env.DB.prepare('SELECT COUNT(*) as total FROM users').first(),
			env.DB.prepare('SELECT COUNT(*) as total FROM short_urls').first()
		]);
		
		return new Response(JSON.stringify({
			success: true,
			stats: {
				totalUsers: usersResult?.total || 0,
				totalUrls: urlsResult?.total || 0
			}
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error getting stats:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Get detailed analytics
 */
async function handleGetAnalytics(request: Request, env: Env): Promise<Response> {
	try {
		const [usersResult, urlsResult, viewsResult] = await Promise.all([
			env.DB.prepare('SELECT COUNT(*) as total FROM users').first(),
			env.DB.prepare('SELECT COUNT(*) as total FROM short_urls').first(),
			env.DB.prepare('SELECT COUNT(*) as total FROM analytics').first()
		]);
		
		// Calculate storage used (this is an approximation)
		let storageUsed = 0;
		try {
			const objects = await env.R2_RDRX.list();
			storageUsed = Math.round(objects.objects.reduce((total, obj) => total + (obj.size || 0), 0) / (1024 * 1024));
		} catch (r2Error) {
			console.error('Error calculating storage:', r2Error);
		}
		
		return new Response(JSON.stringify({
			success: true,
			analytics: {
				totalUsers: usersResult?.total || 0,
				totalUrls: urlsResult?.total || 0,
				totalViews: viewsResult?.total || 0,
				storageUsed
			}
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error getting analytics:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Hash password using Web Crypto API
 */
async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
