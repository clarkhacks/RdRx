import { Env } from '../types';
import { renderBioFormPage } from '../components/pages/BioFormPage';
import { renderBioEditorPage } from '../components/pages/BioEditorPage';
import { renderBioViewPage } from '../components/pages/BioViewPage';
import {
	saveBioProfile,
	getUserBioPage,
	getBioPage,
	getBioLinks,
	isBioShortcodeAvailable,
	getBioSocialMedia,
} from '../utils/database';
import { isAuthenticated, getUserID } from '../utils/auth';

/**
 * Handle bio form page
 */
export async function handleBioFormPage(request: Request, env: Env): Promise<Response> {
	try {
		// Check if user is authenticated
		const authenticated = await isAuthenticated(request, env);
		if (!authenticated) {
			return new Response('Unauthorized', { status: 401 });
		}

		return renderBioFormPage(env);
	} catch (error) {
		console.error('Error rendering bio form page:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return new Response('Internal Server Error: ' + errorMessage, { status: 500 });
	}
}

/**
 * Handle bio editor page
 */
export async function handleBioEditorPage(request: Request, env: Env): Promise<Response> {
	try {
		// Check if user is authenticated
		const authenticated = await isAuthenticated(request, env);
		if (!authenticated) {
			return new Response('Unauthorized', { status: 401 });
		}

		return renderBioEditorPage(request, env);
	} catch (error) {
		console.error('Error rendering bio editor page:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return new Response('Internal Server Error: ' + errorMessage, { status: 500 });
	}
}

/**
 * Handle getting user's bio page data
 */
export async function handleGetUserBio(request: Request, env: Env): Promise<Response> {
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

		const bioPage = await getUserBioPage(env, userId);
		if (!bioPage) {
			return new Response(JSON.stringify({ success: true, bioPage: null, links: [] }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const links = await getBioLinks(env, userId);
		const socialMedia = await getBioSocialMedia(env, userId);

		return new Response(
			JSON.stringify({
				success: true,
				bioPage,
				links,
				socialMedia,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error getting user bio:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return new Response(JSON.stringify({ success: false, message: 'Internal Server Error: ' + errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Handle saving bio page
 */
export async function handleSaveBio(request: Request, env: Env): Promise<Response> {
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

		const body = (await request.json()) as {
			shortcode: string;
			title: string;
			description?: string;
			links: Array<{
				title: string;
				url: string;
				description?: string;
				icon?: string;
				order_index: number;
			}>;
			socialMedia?: Record<string, any>;
			metaTitle?: string;
			metaDescription?: string;
			metaTags?: string;
			ogImageUrl?: string;
		};

		let { shortcode, title, description, links, socialMedia, metaTitle, metaDescription, metaTags, ogImageUrl } = body;

		if (!shortcode || !title) {
			return new Response(JSON.stringify({ success: false, message: 'Shortcode and title are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Get the user's existing bio page if they have one
		const existingBioPage = await getUserBioPage(env, userId);
		const isEditing = existingBioPage !== null;

		// If the user is editing their bio page and changing the shortcode,
		// or if they're creating a new bio page, check if the shortcode is available
		if (!isEditing || (isEditing && existingBioPage.shortcode !== shortcode)) {
			const isAvailable = await isBioShortcodeAvailable(env, shortcode, userId);
			if (!isAvailable) {
				return new Response(JSON.stringify({ success: false, message: 'This shortcode is already taken by another user' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				});
			}
		}

		try {
			// Convert social media object to array format
			const socialMediaArray = socialMedia ? Object.entries(socialMedia).map(([platform, data]) => ({
				platform,
				url: data.url,
				icon: data.icon || ''
			})) : [];

			// Save complete bio profile with all data
			await saveBioProfile(
				env, 
				userId, 
				shortcode, 
				title, 
				description, 
				null, // profile picture URL
				'default', // theme
				links, // bio links array
				socialMediaArray, // social media links array
				metaTitle, // meta title
				metaDescription, // meta description
				metaTags, // meta tags
				ogImageUrl // OG image URL
			);
		} catch (error) {
			console.error('Error in bio save operations:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			return new Response(JSON.stringify({ success: false, message: 'Error saving bio data: ' + errorMessage }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(
			JSON.stringify({
				success: true,
				shortcode: shortcode,
				message: isEditing ? 'Bio page updated successfully' : 'Bio page created successfully',
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error saving bio page:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return new Response(JSON.stringify({ success: false, message: 'Internal Server Error: ' + errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Handle viewing a bio page
 */
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
			// Generate unique filename
			const timestamp = Date.now();
			const extension = ogImageFile.name.split('.').pop() || 'jpg';
			const filename = `og-${userId}-${timestamp}.${extension}`;

			// Convert file to array buffer
			const arrayBuffer = await ogImageFile.arrayBuffer();
			const uint8Array = new Uint8Array(arrayBuffer);

			// Upload to R2 bucket (assuming you have R2 configured)
			if (env.BUCKET) {
				await env.BUCKET.put(filename, uint8Array, {
					httpMetadata: {
						contentType: ogImageFile.type,
					},
				});

				// Return the public URL
				const imageUrl = `https://your-r2-domain.com/${filename}`;
				
				return new Response(JSON.stringify({ 
					success: true, 
					imageUrl: imageUrl 
				}), {
					headers: { 'Content-Type': 'application/json' },
				});
			} else {
				// Fallback: return a placeholder URL or handle differently
				return new Response(JSON.stringify({ 
					success: false, 
					message: 'File storage not configured' 
				}), {
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				});
			}
		} catch (uploadError) {
			console.error('Error uploading OG image:', uploadError);
			return new Response(JSON.stringify({ 
				success: false, 
				message: 'Failed to upload image' 
			}), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
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

/**
 * Handle viewing a bio page
 */
export async function handleViewBio(request: Request, env: Env, shortcode: string): Promise<Response> {
	try {
		console.log(`Handling view bio request for shortcode: ${shortcode}`);

		// Validate shortcode
		if (!shortcode || typeof shortcode !== 'string') {
			console.error('Invalid shortcode:', shortcode);
			return new Response('Invalid shortcode', { status: 400 });
		}

		// Get bio page data
		const bioPage = await getBioPage(env, shortcode);
		if (!bioPage) {
			console.error('Bio page not found for shortcode:', shortcode);
			return new Response('Bio page not found', { status: 404 });
		}

		console.log('Bio page found:', bioPage);

		// Get the user ID for fetching links and social media
		let userId = shortcode;
		
		// If this is a custom shortcode, get the user ID from the database
		if (!shortcode.includes('-') || shortcode.length <= 20) {
			const shortUrlInfo = await env.DB.prepare(`SELECT creator_id FROM short_urls WHERE shortcode = ? AND is_bio = 1`).bind(shortcode).first();
			if (shortUrlInfo && shortUrlInfo.creator_id) {
				userId = shortUrlInfo.creator_id as string;
			}
		}

		// Get bio links using user ID
		let links = [];
		try {
			links = await getBioLinks(env, userId);
			console.log(`Found ${links.length} links for bio page`);
		} catch (linkError) {
			console.error('Error fetching bio links:', linkError);
			// Continue with empty links array
		}

		// Get social media links using user ID
		let socialMedia = {};
		try {
			socialMedia = await getBioSocialMedia(env, userId);
			console.log(`Found social media links for bio page`);
		} catch (socialError) {
			console.error('Error fetching social media links:', socialError);
			// Continue with empty social media object
		}

		// Get the creator's profile picture if available
		let creatorProfilePicture = null;
		try {
			// Get the creator ID from the short_urls table
			const shortUrlInfo = await env.DB.prepare(`SELECT creator_id FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

			if (shortUrlInfo && shortUrlInfo.creator_id) {
				console.log('Found creator ID:', shortUrlInfo.creator_id);
				// Get the user's profile picture
				const userInfo = await env.DB.prepare(`SELECT profile_picture_url FROM users WHERE uid = ?`).bind(shortUrlInfo.creator_id).first();
				if (userInfo && userInfo.profile_picture_url) {
					creatorProfilePicture = userInfo.profile_picture_url;
					console.log('Found creator profile picture');
				}
			}
		} catch (error) {
			console.error('Error fetching creator profile picture:', error);
			// Continue without the profile picture if there's an error
		}

		// Use the creator's profile picture if available, otherwise use the one from the bio page
		const profilePictureUrl = creatorProfilePicture || bioPage.profile_picture_url || null;
		console.log('Using profile picture URL:', profilePictureUrl);

		// Ensure SHORT_DOMAIN is available
		if (!env.SHORT_DOMAIN) {
			console.error('SHORT_DOMAIN is not defined in environment');
			env.SHORT_DOMAIN = 'rdrx.co'; // Fallback to default domain
		}

		// Render bio page view using the reusable template
		try {
			const html = renderBioViewPage({
				bioPage,
				links: links || [],
				shortDomain: env.SHORT_DOMAIN,
				profilePictureUrl,
				socialMedia,
			});

			return new Response(html, {
				headers: { 'Content-Type': 'text/html' },
			});
		} catch (renderError) {
			console.error('Error rendering bio view:', renderError);
			return new Response('Error rendering bio page: ' + (renderError instanceof Error ? renderError.message : 'Unknown error'), {
				status: 500,
			});
		}
	} catch (error) {
		console.error('Error viewing bio page:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return new Response('Internal Server Error: ' + errorMessage, { status: 500 });
	}
}
