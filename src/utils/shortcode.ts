/**
 * Generate a random shortcode
 * @returns A random 6-character shortcode
 */
export function generateShortcode(): string {
	return Math.random().toString(36).substr(2, 6);
}

/**
 * Extract shortcode from a request URL
 * @param request The request object
 * @returns The shortcode or null if not found
 */
export function getShortcodeFromRequest(request: { url: string | URL }): string | null {
	const url = new URL(typeof request.url === 'string' ? request.url : request.url.toString());
	const shortcode = url.pathname.substring(1);
	return shortcode && shortcode.length >= 2 ? shortcode : null;
}

/**
 * Check if a shortcode is a snippet shortcode
 * @param shortcode The shortcode to check
 * @returns True if the shortcode is a snippet shortcode
 */
export function isSnippetShortcode(shortcode: string): boolean {
	return shortcode.startsWith('c-');
}

/**
 * Check if a shortcode is a file shortcode
 * @param shortcode The shortcode to check
 * @returns True if the shortcode is a file shortcode
 */
export function isFileShortcode(shortcode: string): boolean {
	return shortcode.startsWith('f-');
}

/**
 * Check if a shortcode is a special shortcode (19102- prefix)
 * @param shortcode The shortcode to check
 * @returns True if the shortcode is a special shortcode
 */
export function isSpecialShortcode(shortcode: string): boolean {
	return shortcode.startsWith('19102-');
}

/**
 * Get the file extension from a shortcode
 * @param shortcode The shortcode to extract the extension from
 * @returns The file extension or 'txt' if not found
 */
export function getFileExtensionFromShortcode(shortcode: string): string {
	const parts = shortcode.split('.');
	return parts.length > 1 ? parts[1] : 'txt';
}

/**
 * Get the content type for a file extension
 * @param extension The file extension
 * @returns The content type
 */
export function getContentTypeForExtension(extension: string): string {
	const contentTypes: Record<string, string> = {
		js: 'application/javascript',
		css: 'text/css',
		html: 'text/html; charset=utf-8',
		txt: 'text/plain; charset=utf-8',
		json: 'application/json',
		png: 'image/png',
		// Add more as needed
	};

	return contentTypes[extension] || 'text/plain';
}
