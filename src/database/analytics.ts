import { Env } from '../types';

/**
 * Analytics data structure
 */
export interface AnalyticsData {
	id: number;
	shortcode: string;
	target_url: string;
	country: string | null;
	timestamp: string;
}

/**
 * Track a view in the analytics table
 * 
 * Records minimal analytics data when a shortcode is accessed.
 * Captures the country from Cloudflare's request metadata if available.
 * 
 * @param request - The incoming HTTP request
 * @param env - Cloudflare Workers environment bindings
 * @param shortcode - The shortcode that was accessed
 * @param redirectUrl - The target URL that was redirected to
 * @returns Promise that resolves when tracking is complete
 * 
 * @example
 * await trackView(request, env, 'abc123', 'https://example.com');
 * 
 * @remarks
 * This function does not throw errors - failures are logged but don't interrupt the redirect.
 * Analytics tracking is designed to be non-blocking and fault-tolerant.
 * Only essential data is stored to minimize database size and comply with privacy best practices.
 */
export async function trackView(request: Request, env: Env, shortcode: string, redirectUrl: string): Promise<void> {
	try {
		// Extract only essential data
		const timestamp = new Date().toISOString();
		const country =
			request.cf && typeof request.cf === 'object' && request.cf !== null
				? typeof request.cf.country === 'string'
					? request.cf.country
					: ''
				: '';

		// Insert minimal view data into D1
		await env.DB.prepare(
			`INSERT INTO analytics (
        shortcode, 
        target_url, 
        country,
        timestamp
      ) VALUES (?, ?, ?, ?)`
		)
			.bind(shortcode, redirectUrl, country, timestamp)
			.run();

		console.log(`Analytics tracked for shortcode: ${shortcode}`);
	} catch (error) {
		console.error('Error tracking analytics:', error);
	}
}

/**
 * Get analytics data for a shortcode
 * 
 * Retrieves all analytics records for a specific shortcode.
 * 
 * @param shortcode - The shortcode to get analytics for
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise resolving to an array of analytics data
 * 
 * @example
 * const analytics = await getAnalytics('abc123', env);
 * console.log(`Total views: ${analytics.length}`);
 * 
 * @remarks
 * Returns an empty array if no analytics data exists or on error.
 * Results are ordered by timestamp (newest first).
 */
export async function getAnalytics(shortcode: string, env: Env): Promise<AnalyticsData[]> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM analytics WHERE shortcode = ? ORDER BY timestamp DESC`).bind(shortcode).all();

		if (result && result.results) {
			return result.results as unknown as AnalyticsData[];
		}

		return [];
	} catch (error) {
		console.error('Error getting analytics:', error);
		return [];
	}
}
