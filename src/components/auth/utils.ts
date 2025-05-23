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
 * Hash a password using Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	const passwordHash = await hashPassword(password);
	return passwordHash === hash;
}

/**
 * Create a JWT token for session management
 */
export async function createSessionToken(sessionData: SessionData, secret: string): Promise<string> {
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
	const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
	const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

	const message = `${headerB64}.${payloadB64}`;
	const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
	const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');

	return `${message}.${signatureB64}`;
}

/**
 * Verify and decode a JWT token
 */
export async function verifySessionToken(token: string, secret: string): Promise<SessionData | null> {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;

		const [headerB64, payloadB64, signatureB64] = parts;

		// Verify signature
		const encoder = new TextEncoder();
		const message = `${headerB64}.${payloadB64}`;
		const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);

		const signature = Uint8Array.from(
			atob(
				signatureB64
					.replace(/-/g, '+')
					.replace(/_/g, '/')
					.padEnd(signatureB64.length + ((4 - (signatureB64.length % 4)) % 4), '=')
			),
			(c) => c.charCodeAt(0)
		);

		const isValid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(message));
		if (!isValid) return null;

		// Decode payload
		const payload = JSON.parse(
			atob(
				payloadB64
					.replace(/-/g, '+')
					.replace(/_/g, '/')
					.padEnd(payloadB64.length + ((4 - (payloadB64.length % 4)) % 4), '=')
			)
		);

		// Check expiration
		if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
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
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
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

	if (!/\d/.test(password)) {
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
