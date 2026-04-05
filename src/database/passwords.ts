import { Env } from '../types';
import { verifyPassword } from '../utils/crypto';

/**
 * Legacy password hashing function
 * 
 * @deprecated Use hashPassword from '../utils/crypto' instead.
 * This function uses SHA-256 which is not secure for password hashing.
 * The new crypto module uses PBKDF2 with 100,000 iterations.
 * 
 * @param password - The password to hash
 * @returns Promise resolving to the hashed password
 * 
 * @remarks
 * This function is kept for backward compatibility only.
 * New code should use the crypto module's hashPassword function.
 */
export async function hashPassword(password: string): Promise<string> {
	// Convert the password string to an array of bytes
	const encoder = new TextEncoder();
	const data = encoder.encode(password);

	// Hash the password using SHA-256
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);

	// Convert the hash to a hex string
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

	return hashHex;
}

/**
 * Check if a shortcode is password protected
 * 
 * Queries the database to determine if a shortcode requires password authentication.
 * 
 * @param shortcode - The shortcode to check
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise resolving to true if password protected, false otherwise
 * 
 * @example
 * const isProtected = await isShortcodePasswordProtected('abc123', env);
 * if (isProtected) {
 *   // Prompt for password
 * }
 * 
 * @remarks
 * Returns false if the shortcode doesn't exist or on database errors.
 */
export async function isShortcodePasswordProtected(shortcode: string, env: Env): Promise<boolean> {
	try {
		const result = await env.DB.prepare(`SELECT is_password_protected FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

		if (result && typeof result === 'object' && 'is_password_protected' in result) {
			return result.is_password_protected === 1;
		}

		return false;
	} catch (error) {
		console.error('Error checking if shortcode is password protected:', error);
		return false;
	}
}

/**
 * Verify a password for a shortcode
 * 
 * Checks if the provided password matches the stored hash for a shortcode.
 * Supports both legacy SHA-256 hashes and new PBKDF2 hashes.
 * Automatically upgrades legacy hashes to the new format on successful verification.
 * 
 * @param shortcode - The shortcode to verify password for
 * @param password - The password to verify
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise resolving to true if password is correct, false otherwise
 * 
 * @example
 * const isValid = await verifyShortcodePassword('abc123', 'secret', env);
 * if (isValid) {
 *   // Grant access
 * }
 * 
 * @remarks
 * Password hash migration strategy:
 * - New hashes (PBKDF2) contain ':' separator
 * - Old hashes (SHA-256) are plain hex strings
 * - On successful verification of old hash, automatically upgrades to new format
 * - This provides seamless migration without user intervention
 */
export async function verifyShortcodePassword(shortcode: string, password: string, env: Env): Promise<boolean> {
	try {
		const result = await env.DB.prepare(`SELECT password_hash FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

		if (result && typeof result === 'object' && 'password_hash' in result && result.password_hash) {
			const storedHash = result.password_hash as string;

			// Check if it's new format (contains ':' separator for PBKDF2)
			if (storedHash.includes(':')) {
				// New PBKDF2 format - use secure verification
				return await verifyPassword(password, storedHash);
			} else {
				// Old SHA-256 format - verify and upgrade
				const oldHash = await hashPassword(password);
				if (oldHash === storedHash) {
					// Password correct - upgrade to new format
					// Note: We import hashPassword from crypto here to avoid circular dependency
					const { hashPassword: newHashPassword } = await import('../utils/crypto');
					const newHash = await newHashPassword(password);
					await env.DB.prepare(`UPDATE short_urls SET password_hash = ? WHERE shortcode = ?`).bind(newHash, shortcode).run();
					console.log(`Upgraded password hash for shortcode: ${shortcode}`);
					return true;
				}
				return false;
			}
		}

		return false;
	} catch (error) {
		console.error('Error verifying shortcode password:', error);
		return false;
	}
}
