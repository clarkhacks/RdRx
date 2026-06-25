import { Env } from '../../types';

/**
 * Get URLs with pagination and filtering
 */
export async function handleGetUrls(request: Request, env: Env): Promise<Response> {
	try {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const search = url.searchParams.get('search') || '';
		const filter = url.searchParams.get('filter') || '';

		const offset = (page - 1) * limit;

		// Build query based on filters
		let query = `
			SELECT s.shortcode, s.target_url as url, s.type, s.created_at, u.name as user_name
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
			whereClause += whereClause ? " AND s.type = 'url'" : " WHERE s.type = 'url'";
		} else if (filter === 'snippet') {
			whereClause += whereClause ? " AND s.type = 'snippet'" : " WHERE s.type = 'snippet'";
		} else if (filter === 'file') {
			whereClause += whereClause ? " AND s.type = 'file'" : " WHERE s.type = 'file'";
		}

		query += whereClause + ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
		countQuery += whereClause;

		params.push(limit, offset);

		const [urlsResult, countResult] = await Promise.all([
			env.DB.prepare(query)
				.bind(...params)
				.all(),
			env.DB.prepare(countQuery)
				.bind(...countParams)
				.first(),
		]);

		const total = (countResult?.total as number) || 0;
		const totalPages = Math.ceil(total / limit);

		return new Response(
			JSON.stringify({
				success: true,
				urls: urlsResult.results,
				pagination: {
					page,
					limit,
					total,
					totalPages,
					showing: urlsResult.results?.length || 0,
				},
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (error) {
		console.error('Error getting URLs:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Update a URL
 */
export async function handleUpdateUrl(request: Request, env: Env, path: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		const body = (await request.json()) as { url: string };
		const { url } = body;

		await env.DB.prepare(
			`
			UPDATE short_urls SET target_url = ?
			WHERE shortcode = ?
		`,
		)
			.bind(url, shortcode)
			.run();

		return new Response(JSON.stringify({ success: true, message: 'URL updated successfully' }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error updating URL:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to update URL' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Delete a URL and associated files
 */
export async function handleDeleteUrl(request: Request, env: Env, path: string): Promise<Response> {
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
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error deleting URL:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to delete URL' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
