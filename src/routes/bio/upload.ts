import { Env } from '../../types';
import { isAuthenticated, getUserID } from '../../utils/auth';

/**
 * Handle OG image upload
 */
export async function handleOgImageUpload(request: Request, env: Env): Promise<Response> {
	try {
		const authenticated = await isAuthenticated(request, env);
		if (!authenticated) {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const userId = await getUserID(request, env);
		if (!userId) {
			return new Response(JSON.stringify({ success: false, message: 'Unable to get user ID' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const formData = await request.formData();
		const ogImageFile = formData.get('ogImage') as File;

		if (!ogImageFile) {
			return new Response(JSON.stringify({ success: false, message: 'No image file provided' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Validate file type
		if (!ogImageFile.type.startsWith('image/')) {
			return new Response(JSON.stringify({ success: false, message: 'File must be an image' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Validate file size (max 5MB)
		if (ogImageFile.size > 5 * 1024 * 1024) {
			return new Response(JSON.stringify({ success: false, message: 'File size must be less than 5MB' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		try {
			// Generate file path following the same pattern as profile pictures
			const extension = ogImageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
			const filePath = `users/${userId}/og.${extension}`;

			// Convert file to array buffer
			const arrayBuffer = await ogImageFile.arrayBuffer();

			// Upload to R2 bucket
			if (env.R2_RDRX) {
				await env.R2_RDRX.put(filePath, arrayBuffer, {
					httpMetadata: {
						contentType: ogImageFile.type,
					},
				});

				// Return the public URL with timestamp to prevent caching
				const timestamp = Date.now();
				const imageUrl = `${env.R2_URL}/${filePath}?t=${timestamp}`;

				return new Response(
					JSON.stringify({
						success: true,
						imageUrl: imageUrl,
					}),
					{
						headers: { 'Content-Type': 'application/json' },
					},
				);
			} else {
				// Fallback: return error if R2 not configured
				return new Response(
					JSON.stringify({
						success: false,
						message: 'File storage not configured',
					}),
					{
						status: 500,
						headers: { 'Content-Type': 'application/json' },
					},
				);
			}
		} catch (uploadError) {
			console.error('Error uploading OG image:', uploadError);
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Failed to upload image',
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}
	} catch (error) {
		console.error('Error handling OG image upload:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return new Response(JSON.stringify({ success: false, message: 'Internal Server Error: ' + errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
