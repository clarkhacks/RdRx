import { Env } from '../types';

/**
 * Handle user API routes for editing their own content
 */
export async function handleUserRoutes(request: Request, env: Env): Promise<Response | null> {
	const url = new URL(request.url);
	
	// Check if user is authenticated
	if (!request.user) {
		return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Handle different user API endpoints
	if (url.pathname.startsWith('/api/user/')) {
		const path = url.pathname.replace('/api/user/', '');
		const userId = request.user.uid;
		
		console.log('User API path:', path, 'Method:', request.method);
		
		// URL operations
		if (path.startsWith('url/') && request.method === 'PUT') {
			return handleUpdateUserUrl(request, env, path, userId);
		}
		
		// Snippet operations
		if (path.startsWith('snippet/') && request.method === 'GET') {
			return handleGetUserSnippet(request, env, path, userId);
		}
		if (path.startsWith('snippet/') && request.method === 'PUT') {
			return handleUpdateUserSnippet(request, env, path, userId);
		}
		
		// File operations
		if (path.startsWith('files/') && path.endsWith('/upload') && request.method === 'POST') {
			return handleUploadUserFiles(request, env, path, userId);
		}
		if (path.startsWith('files/') && !path.includes('/upload') && path.split('/').length === 2 && request.method === 'GET') {
			return handleGetUserFiles(request, env, path, userId);
		}
		if (path.startsWith('files/') && path.split('/').length === 3 && request.method === 'DELETE') {
			return handleDeleteUserFile(request, env, path, userId);
		}
		
		// Delete operations
		if (path.startsWith('delete/') && request.method === 'DELETE') {
			return handleDeleteUserItem(request, env, path, userId);
		}
		
		return new Response(JSON.stringify({ success: false, message: 'Not found', path: path, method: request.method }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return null;
}

/**
 * Update a user's URL
 */
async function handleUpdateUserUrl(request: Request, env: Env, path: string, userId: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		const body = await request.json() as { url: string };
		const { url } = body;
		
		// Verify the user owns this shortcode
		const existing = await env.DB.prepare('SELECT creator_id FROM short_urls WHERE shortcode = ?').bind(shortcode).first();
		if (!existing || existing.creator_id !== userId) {
			return new Response(JSON.stringify({ success: false, message: 'Not found or unauthorized' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		await env.DB.prepare(`
			UPDATE short_urls SET target_url = ?
			WHERE shortcode = ? AND creator_id = ?
		`).bind(url, shortcode, userId).run();
		
		return new Response(JSON.stringify({ success: true, message: 'URL updated successfully' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error updating user URL:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to update URL' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Get a user's snippet content
 */
async function handleGetUserSnippet(request: Request, env: Env, path: string, userId: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		
		// Verify the user owns this shortcode and it's a snippet
		const existing = await env.DB.prepare('SELECT creator_id, target_url FROM short_urls WHERE shortcode = ? AND is_snippet = 1').bind(shortcode).first();
		if (!existing || existing.creator_id !== userId) {
			return new Response(JSON.stringify({ success: false, message: 'Not found or unauthorized' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		return new Response(JSON.stringify({ 
			success: true, 
			content: existing.target_url 
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error getting user snippet:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to get snippet' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Update a user's snippet
 */
async function handleUpdateUserSnippet(request: Request, env: Env, path: string, userId: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		const body = await request.json() as { content: string };
		const { content } = body;
		
		// Verify the user owns this shortcode and it's a snippet
		const existing = await env.DB.prepare('SELECT creator_id FROM short_urls WHERE shortcode = ? AND is_snippet = 1').bind(shortcode).first();
		if (!existing || existing.creator_id !== userId) {
			return new Response(JSON.stringify({ success: false, message: 'Not found or unauthorized' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		await env.DB.prepare(`
			UPDATE short_urls SET target_url = ?
			WHERE shortcode = ? AND creator_id = ?
		`).bind(content, shortcode, userId).run();
		
		return new Response(JSON.stringify({ success: true, message: 'Snippet updated successfully' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error updating user snippet:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to update snippet' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Get a user's files for a shortcode
 */
async function handleGetUserFiles(request: Request, env: Env, path: string, userId: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		
		// Verify the user owns this shortcode and it's a file upload
		const existing = await env.DB.prepare('SELECT creator_id, target_url FROM short_urls WHERE shortcode = ? AND is_file = 1').bind(shortcode).first();
		if (!existing || existing.creator_id !== userId) {
			return new Response(JSON.stringify({ success: false, message: 'Not found or unauthorized' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Parse the file URLs from the target_url (which is a JSON array)
		const fileUrls = JSON.parse(existing.target_url as string);
		const files = fileUrls.map((url: string) => {
			const filename = url.split('/').pop() || '';
			const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);
			return {
				name: filename.replace(/^[^-]+-/, ''), // Remove the shortcode prefix
				url: url,
				isImage: isImage
			};
		});
		
		return new Response(JSON.stringify({ 
			success: true, 
			files: files 
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error getting user files:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to get files' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Delete a specific file from a user's file upload
 */
async function handleDeleteUserFile(request: Request, env: Env, path: string, userId: string): Promise<Response> {
	try {
		const pathParts = path.split('/');
		const shortcode = pathParts[1];
		const filename = decodeURIComponent(pathParts[2]);
		
		// Verify the user owns this shortcode and it's a file upload
		const existing = await env.DB.prepare('SELECT creator_id, target_url FROM short_urls WHERE shortcode = ? AND is_file = 1').bind(shortcode).first();
		if (!existing || existing.creator_id !== userId) {
			return new Response(JSON.stringify({ success: false, message: 'Not found or unauthorized' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Parse current file URLs
		const fileUrls = JSON.parse(existing.target_url as string);
		
		// Find and remove the file URL that matches the filename
		const updatedUrls = fileUrls.filter((url: string) => {
			const urlFilename = url.split('/').pop() || '';
			const cleanFilename = urlFilename.replace(/^[^-]+-/, ''); // Remove shortcode prefix
			return cleanFilename !== filename;
		});
		
		// Delete the file from R2
		const fileToDelete = fileUrls.find((url: string) => {
			const urlFilename = url.split('/').pop() || '';
			const cleanFilename = urlFilename.replace(/^[^-]+-/, '');
			return cleanFilename === filename;
		});
		
		if (fileToDelete) {
			try {
				// Extract the R2 key from the URL
				const r2Key = fileToDelete.replace('https://cdn.rdrx.co/', '');
				await env.R2_RDRX.delete(r2Key);
			} catch (r2Error) {
				console.error('Error deleting file from R2:', r2Error);
			}
		}
		
		// Update the database with the new file list
		if (updatedUrls.length === 0) {
			// If no files left, delete the entire shortcode
			await env.DB.prepare('DELETE FROM short_urls WHERE shortcode = ? AND creator_id = ?').bind(shortcode, userId).run();
		} else {
			// Update with remaining files
			await env.DB.prepare(`
				UPDATE short_urls SET target_url = ?
				WHERE shortcode = ? AND creator_id = ?
			`).bind(JSON.stringify(updatedUrls), shortcode, userId).run();
		}
		
		return new Response(JSON.stringify({ success: true, message: 'File deleted successfully' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error deleting user file:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to delete file' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Upload new files to an existing file shortcode
 */
async function handleUploadUserFiles(request: Request, env: Env, path: string, userId: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		
		// Verify the user owns this shortcode and it's a file upload
		const existing = await env.DB.prepare('SELECT creator_id, target_url FROM short_urls WHERE shortcode = ? AND is_file = 1').bind(shortcode).first();
		if (!existing || existing.creator_id !== userId) {
			return new Response(JSON.stringify({ success: false, message: 'Not found or unauthorized' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		const formData = await request.formData();
		const files = formData.getAll('files') as File[];
		
		if (files.length === 0) {
			return new Response(JSON.stringify({ success: false, message: 'No files provided' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Parse current file URLs
		const currentUrls = JSON.parse(existing.target_url as string);
		const newUrls = [];
		
		// Upload new files to R2
		for (const file of files) {
			const key = `uploads/${shortcode}-${file.name}`;
			await env.R2_RDRX.put(key, file.stream());
			const url = `https://cdn.rdrx.co/${key}`;
			newUrls.push(url);
		}
		
		// Combine current and new URLs
		const allUrls = [...currentUrls, ...newUrls];
		
		// Update the database
		await env.DB.prepare(`
			UPDATE short_urls SET target_url = ?
			WHERE shortcode = ? AND creator_id = ?
		`).bind(JSON.stringify(allUrls), shortcode, userId).run();
		
		return new Response(JSON.stringify({ 
			success: true, 
			message: 'Files uploaded successfully',
			newFiles: newUrls.length
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error uploading user files:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to upload files' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

/**
 * Delete a user's item (URL, snippet, or file upload)
 */
async function handleDeleteUserItem(request: Request, env: Env, path: string, userId: string): Promise<Response> {
	try {
		const shortcode = path.split('/')[1];
		
		// Verify the user owns this shortcode
		const existing = await env.DB.prepare('SELECT creator_id, target_url, is_file FROM short_urls WHERE shortcode = ?').bind(shortcode).first();
		if (!existing || existing.creator_id !== userId) {
			return new Response(JSON.stringify({ success: false, message: 'Not found or unauthorized' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// If it's a file upload, delete files from R2
		if (existing.is_file === 1) {
			try {
				const fileUrls = JSON.parse(existing.target_url as string);
				for (const url of fileUrls) {
					const r2Key = url.replace('https://cdn.rdrx.co/', '');
					await env.R2_RDRX.delete(r2Key);
				}
			} catch (r2Error) {
				console.error('Error deleting files from R2:', r2Error);
			}
		}
		
		// Delete from database
		await env.DB.prepare('DELETE FROM short_urls WHERE shortcode = ? AND creator_id = ?').bind(shortcode, userId).run();
		await env.DB.prepare('DELETE FROM deletions WHERE shortcode = ?').bind(shortcode).run();
		
		return new Response(JSON.stringify({ success: true, message: 'Item deleted successfully' }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error deleting user item:', error);
		return new Response(JSON.stringify({ success: false, message: 'Failed to delete item' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
