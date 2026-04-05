import { Env } from '../types';

/**
 * Save a URL to the D1 database
 * 
 * Stores a shortcode-to-URL mapping in the database with optional password protection.
 * Automatically detects the type of shortcode (snippet, file, or bio) based on prefix.
 * 
 * @param shortcode - The unique shortcode identifier
 * @param url - The target URL to redirect to
 * @param env - Cloudflare Workers environment bindings
 * @param creatorId - Optional user ID of the creator
 * @param passwordHash - Optional hashed password for protection
 * @param isPasswordProtected - Whether the shortcode requires password authentication
 * @returns Promise that resolves when the URL is saved
 * 
 * @throws {Error} When database insertion fails
 * 
 * @example
 * await saveUrlToDatabase('abc123', 'https://example.com', env);
 * 
 * @example
 * // With password protection
 * const hash = await hashPassword('secret');
 * await saveUrlToDatabase('abc123', 'https://example.com', env, userId, hash, true);
 * 
 * @remarks
 * - Shortcodes starting with 'c-' are marked as snippets
 * - Shortcodes starting with 'f-' are marked as files
 * - Shortcodes starting with 'b-' are marked as bio pages
 * - Uses INSERT OR REPLACE to allow updating existing shortcodes
 */
export async function saveUrlToDatabase(
	shortcode: string,
	url: string,
	env: Env,
	creatorId: string | null = null,
	passwordHash: string | null = null,
	isPasswordProtected: boolean = false
): Promise<void> {
	try {
		// Determine if it's a snippet, file, or bio
		const isSnippet = shortcode.startsWith('c-');
		const isFile = shortcode.startsWith('f-');
		const isBio = shortcode.startsWith('b-');

		// Insert into D1
		await env.DB.prepare(
			`INSERT OR REPLACE INTO short_urls 
      (shortcode, target_url, created_at, creator_id, is_snippet, is_file, is_bio, password_hash, is_password_protected)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				shortcode,
				url,
				new Date().toISOString(),
				creatorId,
				isSnippet ? 1 : 0,
				isFile ? 1 : 0,
				isBio ? 1 : 0,
				passwordHash,
				isPasswordProtected ? 1 : 0
			)
			.run();

		console.log(`Saved URL to database: ${shortcode}${isPasswordProtected ? ' (password protected)' : ''}`);
	} catch (error) {
		console.error('Error saving to D1:', error);
		throw error; // Re-throw the error to be handled by the caller
	}
}

/**
 * Fetch a URL from the database by shortcode
 * 
 * Retrieves the target URL associated with a shortcode.
 * Includes special handling for legacy shortcodes with specific prefixes.
 * 
 * @param shortcode - The shortcode to look up
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise resolving to the target URL, or null if not found
 * 
 * @example
 * const url = await fetchUrlByShortcode('abc123', env);
 * if (url) {
 *   console.log('Redirecting to:', url);
 * }
 * 
 * @remarks
 * Special handling for shortcodes starting with '19102-':
 * Appends a date-based query parameter to the URL for tracking purposes.
 * This is legacy behavior maintained for backward compatibility.
 */
export async function fetchUrlByShortcode(shortcode: string, env: Env): Promise<string | null> {
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

		if (result && typeof result === 'object' && 'target_url' in result) {
			const targetUrl = result.target_url as string;

			// Special handling for 19102- prefixed shortcodes
			// This is legacy behavior for a specific use case - appends current date as query param
			if (shortcode.startsWith('19102-')) {
				const today = new Date();
				const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;
				return `${targetUrl}&raf807ea871694f1093d100420e822bff=${formattedDate}`;
			}
			return targetUrl;
		}

		return null;
	} catch (error) {
		console.error('Error fetching from D1:', error);
		return null;
	}
}

/**
 * Get URL from database by shortcode
 * 
 * Alias for fetchUrlByShortcode for backward compatibility.
 * 
 * @param shortcode - The shortcode to look up
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise resolving to the target URL, or null if not found
 * 
 * @deprecated Use fetchUrlByShortcode instead
 */
export async function getUrlFromDatabase(shortcode: string, env: Env): Promise<string | null> {
	return fetchUrlByShortcode(shortcode, env);
}

/**
 * Delete a URL by shortcode
 * 
 * Removes a shortcode and its associated URL from the database.
 * 
 * @param shortcode - The shortcode to delete
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise that resolves when deletion is complete
 * 
 * @throws {Error} When database deletion fails
 * 
 * @example
 * await deleteUrlByShortcode('abc123', env);
 * console.log('Shortcode deleted');
 * 
 * @remarks
 * This does not delete associated analytics data or scheduled deletions.
 * Use the deletion module for comprehensive cleanup.
 */
export async function deleteUrlByShortcode(shortcode: string, env: Env): Promise<void> {
	try {
		await env.DB.prepare(`DELETE FROM short_urls WHERE shortcode = ?`).bind(shortcode).run();
		console.log(`Deleted shortcode: ${shortcode}`);
	} catch (error) {
		console.error('Error deleting shortcode:', error);
		throw error;
	}
}
