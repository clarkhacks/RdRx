import { Env } from '../types';
import { renderBioFormPage } from '../components/pages/BioFormPage';
import {
	saveBioPage,
	getUserBioPage,
	getBioPage,
	getBioLinks,
	saveBioLink,
	deleteBioLink,
	isBioShortcodeAvailable,
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

		const links = await getBioLinks(env, bioPage.shortcode);

		return new Response(
			JSON.stringify({
				success: true,
				bioPage,
				links,
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
		};

		let { shortcode, title, description, links } = body;

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
			// Save bio page with the user-provided shortcode
			await saveBioPage(env, userId, shortcode, title, description);

			// Delete existing links for this bio page
			const existingLinks = await getBioLinks(env, shortcode);
			for (const link of existingLinks) {
				await deleteBioLink(env, link.id);
			}

			// Save new links
			for (const link of links) {
				await saveBioLink(env, shortcode, link.title, link.url, link.description, link.icon, link.order_index);
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
				shortcode,
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

		// Render bio page view
		try {
			const html = renderBioView(bioPage, links || [], env.SHORT_DOMAIN, profilePictureUrl);
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

/**
 * Render bio page view
 */
function renderBioView(bioPage: any, links: any[], shortDomain: string, profilePictureUrl: string | null = null): string {
	// Ensure bioPage has all required properties
	const title = bioPage && bioPage.title ? bioPage.title : 'Bio Page';
	const description = bioPage && bioPage.description ? bioPage.description : 'Check out my bio page';
	const shortcode = bioPage && bioPage.shortcode ? bioPage.shortcode : '';

	// Ensure links is an array
	const safeLinks = Array.isArray(links) ? links : [];

	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta property="og:title" content="${title} | Bio Page">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${profilePictureUrl || 'https://cdn.rdrx.co/banner.jpg'}">
    <meta property="og:url" content="https://${shortDomain}/${shortcode}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RdRx">
    <meta property="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/built.css">
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: linear-gradient(to bottom, #e2d9c2 0%, #65635a 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            margin: 0;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px, rgba(15, 15, 15, 0.1) 0px 8px 16px;
            width: 100%;
            max-width: 600px;
            padding: 40px;
        }
        .profile {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
        }
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .username {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        .bio {
            color: #666;
            text-align: center;
            margin-bottom: 15px;
        }
        .links {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .link-card {
            background: #f5f5f5;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            text-decoration: none;
            color: #333;
            transition: all 0.2s ease;
        }
        .link-card:hover {
            transform: translateY(-2px);
            box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px, rgba(15, 15, 15, 0.05) 0px 8px 16px;
        }
        .link-icon {
            width: 48px;
            height: 48px;
            background: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 16px;
            flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        .link-content {
            flex-grow: 1;
            overflow: hidden;
        }
        .link-title {
            font-weight: 600;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .link-description {
            color: #666;
            font-size: 0.875rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }
        .social-icon {
            width: 24px;
            height: 24px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .social-icon:hover {
            opacity: 1;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.75rem;
            color: #999;
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body {
                background: linear-gradient(to bottom, #2d2c2a 0%, #1a1a1a 100%);
            }
            .container {
                background: #222;
                box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 8px 16px;
            }
            .username {
                color: #fff;
            }
            .bio {
                color: #aaa;
            }
            .link-card {
                background: #333;
                color: #eee;
            }
            .link-icon {
                background: #444;
            }
            .link-description {
                color: #aaa;
            }
            .social-icon {
                color: #ddd;
            }
            .footer {
                color: #777;
            }
            .footer a {
                color: #999 !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="profile">
            <div class="avatar">
                <img src="${profilePictureUrl || 'https://via.placeholder.com/80'}" alt="${title}" 
                     onerror="this.src='https://via.placeholder.com/80?text=👤'">
            </div>
            <h1 class="username">${title}</h1>
            ${description ? `<p class="bio">${description}</p>` : ''}
        </div>

        <div class="links">
            ${safeLinks
							.map(
								(link) => `
                    <a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" class="link-card">
                        <div class="link-icon">
                            ${link.icon || '🔗'}
                        </div>
                        <div class="link-content">
                            <h3 class="link-title">${link.title || 'Link'}</h3>
                            ${link.description ? `<p class="link-description">${link.description}</p>` : ''}
                        </div>
                    </a>
                `
							)
							.join('')}
        </div>

        <div class="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            </a>
        </div>

        <div class="footer">
            Powered by <a href="https://${shortDomain}" style="color: #666; text-decoration: underline;">RdRx</a>
        </div>
    </div>
</body>
</html>
	`;
}
