import { SessionData } from './types';

/**
 * Generate a random UID
 */
export function generateUID(): string {
	return crypto.randomUUID();
}

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a random salt
 */
function generateSalt(): string {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a password using PBKDF2 with salt
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = generateSalt();
	const encoder = new TextEncoder();

	// Import the password as a key
	const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);

	// Derive the hash using PBKDF2
	const hashBuffer = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: encoder.encode(salt),
			iterations: 100000,
			hash: 'SHA-256',
		},
		keyMaterial,
		256
	);

	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

	// Return salt:hash format
	return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	try {
		const [salt, hash] = storedHash.split(':');
		if (!salt || !hash) {
			console.error('Invalid hash format');
			return false;
		}

		const encoder = new TextEncoder();

		// Import the password as a key
		const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);

		// Derive the hash using the same salt
		const hashBuffer = await crypto.subtle.deriveBits(
			{
				name: 'PBKDF2',
				salt: encoder.encode(salt),
				iterations: 100000,
				hash: 'SHA-256',
			},
			keyMaterial,
			256
		);

		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const computedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

		return computedHash === hash;
	} catch (error) {
		console.error('Error verifying password:', error);
		return false;
	}
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
	return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
	// Add padding if needed
	const padding = '='.repeat((4 - (str.length % 4)) % 4);
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding;
	return atob(base64);
}

/**
 * Create a JWT token for session management
 */
export async function createSessionToken(sessionData: SessionData, secret: string): Promise<string> {
	try {
		const header = {
			alg: 'HS256',
			typ: 'JWT',
		};

		const payload = {
			...sessionData,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(sessionData.expires_at / 1000),
		};

		const encoder = new TextEncoder();
		const headerB64 = base64UrlEncode(JSON.stringify(header));
		const payloadB64 = base64UrlEncode(JSON.stringify(payload));

		const message = `${headerB64}.${payloadB64}`;
		const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

		const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
		const signatureArray = new Uint8Array(signature);
		const signatureB64 = base64UrlEncode(String.fromCharCode(...signatureArray));

		return `${message}.${signatureB64}`;
	} catch (error) {
		console.error('Error creating session token:', error);
		throw error;
	}
}

/**
 * Verify and decode a JWT token
 */
export async function verifySessionToken(token: string, secret: string): Promise<SessionData | null> {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) {
			console.error('Invalid token format');
			return null;
		}

		const [headerB64, payloadB64, signatureB64] = parts;

		// Verify signature
		const encoder = new TextEncoder();
		const message = `${headerB64}.${payloadB64}`;
		const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);

		const signatureBytes = Uint8Array.from(base64UrlDecode(signatureB64), (c) => c.charCodeAt(0));
		const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(message));

		if (!isValid) {
			console.error('Invalid token signature');
			return null;
		}

		// Decode payload
		const payload = JSON.parse(base64UrlDecode(payloadB64));

		// Check expiration
		if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
			console.error('Token expired');
			return null;
		}

		return {
			uid: payload.uid,
			email: payload.email,
			name: payload.name,
			created_at: payload.created_at,
			expires_at: payload.expires_at,
		};
	} catch (error) {
		console.error('Error verifying session token:', error);
		return null;
	}
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	// More comprehensive email regex that handles various valid email formats
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(String(email).toLowerCase());
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
	if (password.length < 8) {
		return { valid: false, message: 'Password must be at least 8 characters long' };
	}

	if (!/[A-Z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one uppercase letter' };
	}

	if (!/[a-z]/.test(password)) {
		return { valid: false, message: 'Password must contain at least one lowercase letter' };
	}

	// Explicitly check for at least one digit (0-9)
	const hasNumber = /[0-9]/.test(password);
	if (!hasNumber) {
		return { valid: false, message: 'Password must contain at least one number' };
	}

	return { valid: true };
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase();
	return ext || '';
}

/**
 * Validate profile picture file type
 */
export function isValidProfilePictureType(filename: string): boolean {
	const validExtensions = ['png', 'jpg', 'jpeg', 'webp'];
	const extension = getFileExtension(filename);
	return validExtensions.includes(extension);
}

/**
 * Generate profile picture path for R2
 */
export function generateProfilePicturePath(uid: string, filename: string): string {
	const extension = getFileExtension(filename);
	return `users/${uid}/profile.${extension}`;
}

/**
 * Create session data
 */
export function createSessionData(uid: string, email: string, name: string, expiresInHours: number = 24): SessionData {
	const now = Date.now();
	return {
		uid,
		email,
		name,
		created_at: now,
		expires_at: now + expiresInHours * 60 * 60 * 1000,
	};
}

/**
 * Extract session token from request headers
 */
export function extractSessionToken(request: Request): string | null {
	const authHeader = request.headers.get('Authorization');
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7);
	}

	// Also check for token in cookies
	const cookieHeader = request.headers.get('Cookie');
	if (cookieHeader) {
		const cookies = cookieHeader.split(';').map((c) => c.trim());
		for (const cookie of cookies) {
			if (cookie.startsWith('auth_token=')) {
				return cookie.substring(11);
			}
		}
	}

	return null;
}
