import { Env } from '../types';
import { renderRotatorFormPage } from '../components/pages/RotatorFormPage';
import { createRotatorLink, getRotatorStats, isRotatorLink } from '../database';
import { saveUrlToDatabase } from '../database/urls';
import { getUserID } from '../utils/auth';

/**
 * Handle rotator form page
 */
export async function handleRotatorFormPage(request: Request, env: Env): Promise<Response> {
	return renderRotatorFormPage(request, env);
}

/**
 * Handle create rotator API
 */
export async function handleCreateRotator(request: Request, env: Env): Promise<Response> {
	try {
		const userId = await getUserID(request, env);
		if (!userId) {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const body = (await request.json()) as {
			shortcode: string;
			name: string;
			description?: string;
			strategy: 'round-robin' | 'weighted' | 'random';
			destinations: Array<{ url: string; weight?: number }>;
		};

		const { shortcode, name, description, strategy, destinations } = body;

		// Validation
		if (!shortcode || !name || !strategy || !destinations || destinations.length < 2) {
			return new Response(JSON.stringify({ success: false, message: 'Invalid request data' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Check if shortcode already exists
		const exists = await env.DB.prepare(`SELECT 1 FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();
		if (exists) {
			return new Response(JSON.stringify({ success: false, message: 'Shortcode already exists' }), {
				status: 409,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Validate strategy-specific requirements
		if (strategy === 'weighted') {
			const totalWeight = destinations.reduce((sum, dest) => sum + (dest.weight || 0), 0);
			if (totalWeight !== 100) {
				return new Response(JSON.stringify({ success: false, message: 'Weights must add up to 100%' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				});
			}
		}

		// Create entry in short_urls table (for shortcode lookup)
		// We use a special marker URL to indicate this is a rotator
		await saveUrlToDatabase(shortcode, `rotator:${shortcode}`, env, userId);

		// Create rotator link with destinations
		await createRotatorLink(env, shortcode, name, strategy, destinations, userId, description || null);

		return new Response(
			JSON.stringify({
				success: true,
				shortcode,
				message: 'Rotator link created successfully',
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error creating rotator:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return new Response(JSON.stringify({ success: false, message: 'Internal Server Error: ' + errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Handle get rotator stats API
 */
export async function handleGetRotatorStats(request: Request, env: Env, shortcode: string): Promise<Response> {
	try {
		const userId = await getUserID(request, env);
		if (!userId) {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Check if it's a rotator link
		const isRotator = await isRotatorLink(env, shortcode);
		if (!isRotator) {
			return new Response(JSON.stringify({ success: false, message: 'Not a rotator link' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Get stats
		const stats = await getRotatorStats(env, shortcode);
		if (!stats) {
			return new Response(JSON.stringify({ success: false, message: 'Rotator not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(
			JSON.stringify({
				success: true,
				stats,
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error getting rotator stats:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return new Response(JSON.stringify({ success: false, message: 'Internal Server Error: ' + errorMessage }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
