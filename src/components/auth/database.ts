import { Env } from '../../types';
import { User } from './types';

/**
 * Initialize the users table in D1
 */
export async function initializeUsersTable(env: Env): Promise<void> {
	try {
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS users (
				uid TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				email TEXT NOT NULL UNIQUE,
				password_hash TEXT NOT NULL,
				profile_picture_url TEXT,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				email_verified BOOLEAN NOT NULL DEFAULT 0,
				reset_token TEXT,
				reset_token_expires TEXT
			)`
		).run();

		// Create index on email for faster lookups
		await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`).run();

		// Create index on reset_token for password reset lookups
		await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token)`).run();

		console.log('Users table initialized');
	} catch (error) {
		console.error('Error initializing users table:', error);
		throw error;
	}
}

/**
 * Create a new user in the database
 */
export async function createUser(env: Env, user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
	try {
		const now = new Date().toISOString();
		const newUser: User = {
			...user,
			created_at: now,
			updated_at: now,
		};

		await env.DB.prepare(
			`INSERT INTO users (
				uid, name, email, password_hash, profile_picture_url,
				created_at, updated_at, email_verified, reset_token, reset_token_expires
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				newUser.uid,
				newUser.name,
				newUser.email,
				newUser.password_hash,
				newUser.profile_picture_url || null,
				newUser.created_at,
				newUser.updated_at,
				newUser.email_verified ? 1 : 0,
				newUser.reset_token || null,
				newUser.reset_token_expires || null
			)
			.run();

		console.log(`User created: ${newUser.email}`);
		return newUser;
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
}

/**
 * Get user by email
 */
export async function getUserByEmail(env: Env, email: string): Promise<User | null> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(email).first();

		if (!result) return null;

		return {
			uid: result.uid as string,
			name: result.name as string,
			email: result.email as string,
			password_hash: result.password_hash as string,
			profile_picture_url: (result.profile_picture_url as string) || undefined,
			created_at: result.created_at as string,
			updated_at: result.updated_at as string,
			email_verified: Boolean(result.email_verified),
			reset_token: (result.reset_token as string) || undefined,
			reset_token_expires: (result.reset_token_expires as string) || undefined,
		};
	} catch (error) {
		console.error('Error getting user by email:', error);
		return null;
	}
}

/**
 * Get user by UID
 */
export async function getUserByUid(env: Env, uid: string): Promise<User | null> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM users WHERE uid = ?`).bind(uid).first();

		if (!result) return null;

		return {
			uid: result.uid as string,
			name: result.name as string,
			email: result.email as string,
			password_hash: result.password_hash as string,
			profile_picture_url: (result.profile_picture_url as string) || undefined,
			created_at: result.created_at as string,
			updated_at: result.updated_at as string,
			email_verified: Boolean(result.email_verified),
			reset_token: (result.reset_token as string) || undefined,
			reset_token_expires: (result.reset_token_expires as string) || undefined,
		};
	} catch (error) {
		console.error('Error getting user by UID:', error);
		return null;
	}
}

/**
 * Update user profile picture URL
 */
export async function updateUserProfilePicture(env: Env, uid: string, profilePictureUrl: string): Promise<void> {
	try {
		await env.DB.prepare(`UPDATE users SET profile_picture_url = ?, updated_at = ? WHERE uid = ?`)
			.bind(profilePictureUrl, new Date().toISOString(), uid)
			.run();

		console.log(`Profile picture updated for user: ${uid}`);
	} catch (error) {
		console.error('Error updating profile picture:', error);
		throw error;
	}
}

/**
 * Set password reset token
 */
export async function setPasswordResetToken(env: Env, email: string, token: string, expiresAt: string): Promise<void> {
	try {
		await env.DB.prepare(`UPDATE users SET reset_token = ?, reset_token_expires = ?, updated_at = ? WHERE email = ?`)
			.bind(token, expiresAt, new Date().toISOString(), email)
			.run();

		console.log(`Password reset token set for: ${email}`);
	} catch (error) {
		console.error('Error setting password reset token:', error);
		throw error;
	}
}

/**
 * Get user by reset token
 */
export async function getUserByResetToken(env: Env, token: string): Promise<User | null> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?`)
			.bind(token, new Date().toISOString())
			.first();

		if (!result) return null;

		return {
			uid: result.uid as string,
			name: result.name as string,
			email: result.email as string,
			password_hash: result.password_hash as string,
			profile_picture_url: (result.profile_picture_url as string) || undefined,
			created_at: result.created_at as string,
			updated_at: result.updated_at as string,
			email_verified: Boolean(result.email_verified),
			reset_token: (result.reset_token as string) || undefined,
			reset_token_expires: (result.reset_token_expires as string) || undefined,
		};
	} catch (error) {
		console.error('Error getting user by reset token:', error);
		return null;
	}
}

/**
 * Update user password and clear reset token
 */
export async function updateUserPassword(env: Env, uid: string, passwordHash: string): Promise<void> {
	try {
		await env.DB.prepare(`UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = ? WHERE uid = ?`)
			.bind(passwordHash, new Date().toISOString(), uid)
			.run();

		console.log(`Password updated for user: ${uid}`);
	} catch (error) {
		console.error('Error updating password:', error);
		throw error;
	}
}

/**
 * Mark user email as verified
 */
export async function markEmailVerified(env: Env, uid: string): Promise<void> {
	try {
		await env.DB.prepare(`UPDATE users SET email_verified = 1, updated_at = ? WHERE uid = ?`).bind(new Date().toISOString(), uid).run();

		console.log(`Email verified for user: ${uid}`);
	} catch (error) {
		console.error('Error marking email as verified:', error);
		throw error;
	}
}
