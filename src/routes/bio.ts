import { Env } from '../types';
import { renderBioFormPage } from '../components/pages/BioFormPage';
import { renderBioViewPage } from '../components/pages/BioViewPage';
import {
	saveBioPage,
	getUserBioPage,
	getBioPage,
	getBioLinks,
	saveBioLink,
	deleteBioLink,
	isBioShortcodeAvailable,
	saveBioSocialMedia,
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
		};

		let { shortcode, title, description, links, socialMedia } = body;

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
			// Save bio page with the user-provided shortcode but render at /bio-view/userId
			await saveBioPage(env, userId, shortcode, title, description);

			// Save new links (existing links are cleared in saveBioPage)
			for (const link of links) {
				await saveBioLink(env, userId, link.title, link.url, link.description, link.icon, link.order_index);
			}

			// Save social media links if provided
			if (socialMedia) {
				await saveBioSocialMedia(env, userId, socialMedia);
			}
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
				shortcode: userId,
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

		// Get bio links
		let links = [];
		try {
			links = await getBioLinks(env, shortcode);
			console.log(`Found ${links.length} links for bio page`);
		} catch (linkError) {
			console.error('Error fetching bio links:', linkError);
			// Continue with empty links array
		}

		// Get social media links
		let socialMedia = {};
		try {
			socialMedia = await getBioSocialMedia(env, shortcode);
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
