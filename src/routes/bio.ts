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
		return new Response('Internal Server Error', { status: 500 });
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
		return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), {
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

		const { shortcode, title, description, links } = body;

		if (!shortcode || !title) {
			return new Response(JSON.stringify({ success: false, message: 'Shortcode and title are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Check if shortcode is available
		const isAvailable = await isBioShortcodeAvailable(env, shortcode, userId);
		if (!isAvailable) {
			return new Response(JSON.stringify({ success: false, message: 'This shortcode is already taken by another user' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Save bio page
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

		return new Response(
			JSON.stringify({
				success: true,
				shortcode,
				message: 'Bio page saved successfully',
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error saving bio page:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), {
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
		const bioPage = await getBioPage(env, shortcode);
		if (!bioPage) {
			return new Response('Bio page not found', { status: 404 });
		}

		const links = await getBioLinks(env, shortcode);

		// Render bio page view
		const html = renderBioView(bioPage, links, env.SHORT_DOMAIN);

		return new Response(html, {
			headers: { 'Content-Type': 'text/html' },
		});
	} catch (error) {
		console.error('Error viewing bio page:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}

/**
 * Render bio page view
 */
function renderBioView(bioPage: any, links: any[], shortDomain: string): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bioPage.title} - Bio Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .link-card {
            transition: all 0.3s ease;
            border-radius: 16px;
        }
        .link-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
    </style>
</head>
<body class="gradient-bg min-h-screen py-8">
    <div class="max-w-md mx-auto px-4">
        <!-- Profile Section -->
        <div class="bg-white rounded-3xl p-8 mb-6 text-center shadow-xl">
            <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👤
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">${bioPage.title}</h1>
            ${bioPage.description ? `<p class="text-gray-600 mb-4">${bioPage.description}</p>` : ''}
        </div>

        <!-- Links Section -->
        <div class="space-y-4">
            ${links
							.map(
								(link) => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                   class="link-card bg-white p-4 rounded-2xl shadow-lg flex items-center space-x-4 hover:bg-gray-50 transition-all duration-300 block">
                    <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        ${link.icon || '🔗'}
                    </div>
                    <div class="flex-grow min-w-0">
                        <h3 class="font-semibold text-gray-800 truncate">${link.title}</h3>
                        ${link.description ? `<p class="text-gray-600 text-sm truncate">${link.description}</p>` : ''}
                    </div>
                    <div class="text-gray-400">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                </a>
            `
							)
							.join('')}
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
            <p class="text-white text-sm opacity-75">
                Powered by <a href="https://${shortDomain}" class="underline hover:opacity-100">RdRx</a>
            </p>
        </div>
    </div>
</body>
</html>
	`;
}
