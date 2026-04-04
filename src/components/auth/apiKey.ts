/**
 * API Key generation and management utilities
 */

/**
 * Generate a secure API key
 * Format: rdrx_live_[32 random characters]
 */
export function generateApiKey(): string {
	const array = new Uint8Array(24); // 24 bytes = 32 base64 characters
	crypto.getRandomValues(array);
	
	// Convert to base64-like string (URL-safe)
	const randomString = Array.from(array, byte => 
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[byte % 62]
	).join('');
	
	return `rdrx_live_${randomString}`;
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
	return /^rdrx_live_[A-Za-z0-9]{24,}$/.test(apiKey);
}
