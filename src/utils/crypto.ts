/**
 * Cryptographic utilities for secure password hashing and token generation
 * 
 * This module provides a unified, secure implementation of cryptographic
 * operations used throughout the application. All password hashing uses
 * PBKDF2 with 100,000 iterations for security.
 * 
 * @module utils/crypto
 */

import { PBKDF2_ITERATIONS, SALT_LENGTH, API_KEY_PREFIX, API_KEY_LENGTH, SHORTCODE_CHARSET } from '../config/constants';

/**
 * Generates a cryptographically secure random salt
 * 
 * @param length - Length of the salt in bytes (default: 16)
 * @returns Hex-encoded salt string
 * 
 * @example
 * const salt = generateSalt(); // "a1b2c3d4e5f6..."
 */
export function generateSalt(length: number = SALT_LENGTH): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a password using PBKDF2 with a random salt
 * 
 * This is the primary password hashing function used for user accounts
 * and password-protected shortcodes. It uses PBKDF2 with 100,000 iterations
 * for strong security against brute-force attacks.
 * 
 * @param password - Plain text password to hash
 * @returns Promise resolving to "salt:hash" format string
 * 
 * @example
 * const hash = await hashPassword("mySecurePassword123");
 * // Returns: "a1b2c3d4...:e5f6g7h8..."
 * 
 * @remarks
 * - Uses PBKDF2 with SHA-256
 * - 100,000 iterations (OWASP recommended minimum)
 * - 16-byte random salt
 * - Output format: "salt:hash" for easy storage and verification
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = generateSalt();
	const hash = await hashPasswordWithSalt(password, salt);
	return `${salt}:${hash}`;
}

/**
 * Hashes a password with a specific salt (used for verification)
 * 
 * @param password - Plain text password
 * @param salt - Hex-encoded salt
 * @returns Promise resolving to hex-encoded hash
 * 
 * @internal
 */
async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
	const encoder = new TextEncoder();
	const passwordBuffer = encoder.encode(password);
	const saltBuffer = hexToBuffer(salt);

	// Import password as key material
	const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveBits']);

	// Derive key using PBKDF2
	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: saltBuffer,
			iterations: PBKDF2_ITERATIONS,
			hash: 'SHA-256',
		},
		keyMaterial,
		256 // 256 bits = 32 bytes
	);

	// Convert to hex string
	return bufferToHex(new Uint8Array(derivedBits));
}

/**
 * Verifies a password against a stored hash
 * 
 * @param password - Plain text password to verify
 * @param storedHash - Stored hash in "salt:hash" format
 * @returns Promise resolving to true if password matches, false otherwise
 * 
 * @example
 * const isValid = await verifyPassword("myPassword", storedHash);
 * if (isValid) {
 *   console.log("Password correct!");
 * }
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	const [salt, hash] = storedHash.split(':');
	if (!salt || !hash) {
		return false;
	}

	const computedHash = await hashPasswordWithSalt(password, salt);
	return computedHash === hash;
}

/**
 * Generates a cryptographically secure random token
 * 
 * Used for email verification tokens, password reset tokens, etc.
 * 
 * @param length - Length of the token in bytes (default: 32)
 * @returns Hex-encoded token string
 * 
 * @example
 * const resetToken = generateToken(32);
 * // Returns: "a1b2c3d4e5f6g7h8..."
 */
export function generateToken(length: number = 32): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return bufferToHex(array);
}

/**
 * Generates a cryptographically secure API key
 * 
 * Format: "rdrx_live_" + 24 random alphanumeric characters
 * 
 * @returns API key string
 * 
 * @example
 * const apiKey = generateApiKey();
 * // Returns: "rdrx_live_A7xK9mP2nQ8vR4wS6tY1zB3c"
 */
export function generateApiKey(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const array = new Uint8Array(API_KEY_LENGTH);
	crypto.getRandomValues(array);

	let key = API_KEY_PREFIX;
	for (let i = 0; i < API_KEY_LENGTH; i++) {
		key += chars[array[i] % chars.length];
	}

	return key;
}

/**
 * Generates a random shortcode for URL shortening
 * 
 * @param length - Length of the shortcode (default: 6)
 * @returns Random shortcode string
 * 
 * @example
 * const code = generateShortcode(); // "aB3xY9"
 * 
 * @remarks
 * - Uses crypto.getRandomValues() for cryptographically secure randomness
 * - Character set: a-z, A-Z, 0-9 (62 possible characters)
 * - Collision probability for 6 characters: ~1 in 56 billion
 */
export function generateShortcode(length: number = 6): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);

	let result = '';
	for (let i = 0; i < length; i++) {
		result += SHORTCODE_CHARSET[array[i] % SHORTCODE_CHARSET.length];
	}

	return result;
}

/**
 * Generates a cryptographically secure random UID
 * 
 * @returns 32-character hex string
 * 
 * @example
 * const uid = generateUid();
 * // Returns: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
 */
export function generateUid(): string {
	return generateToken(16); // 16 bytes = 32 hex characters
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Converts a hex string to a Uint8Array buffer
 * @internal
 */
function hexToBuffer(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
	}
	return bytes;
}

/**
 * Converts a Uint8Array buffer to a hex string
 * @internal
 */
function bufferToHex(buffer: Uint8Array): string {
	return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
