import { Env } from '../types';
import { initializeUsersTable } from '../components/auth/database';

/**
 * Initialize all database tables
 * Call this function once at application startup
 */
export async function initializeTables(env: Env): Promise<void> {
	try {
		// Create short_urls table
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS short_urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcode TEXT NOT NULL UNIQUE,
        target_url TEXT NOT NULL,
        created_at TEXT NOT NULL,
        creator_id TEXT,
        is_snippet BOOLEAN NOT NULL DEFAULT 0,
        is_file BOOLEAN NOT NULL DEFAULT 0,
        password_hash TEXT,
        is_password_protected BOOLEAN NOT NULL DEFAULT 0
      )`
		).run();

		// Create analytics table with minimal fields
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcode TEXT NOT NULL,
        target_url TEXT NOT NULL,
        country TEXT,
        timestamp TEXT NOT NULL
      )`
		).run();

		// Create deletions table
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS deletions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcode TEXT NOT NULL,
        delete_at INTEGER NOT NULL,
        is_file BOOLEAN NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )`
		).run();

		// Initialize users table for custom auth
		await initializeUsersTable(env);

		console.log('All database tables initialized');
	} catch (error) {
		console.error('Error initializing database tables:', error);
		throw error;
	}
}

/**
 * Save a URL to the D1 database
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
		// Determine if it's a snippet or file
		const isSnippet = shortcode.startsWith('c-');
		const isFile = shortcode.startsWith('f-');

		// Insert into D1
		await env.DB.prepare(
			`INSERT OR REPLACE INTO short_urls 
      (shortcode, target_url, created_at, creator_id, is_snippet, is_file, password_hash, is_password_protected)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				shortcode,
				url,
				new Date().toISOString(),
				creatorId,
				isSnippet ? 1 : 0,
				isFile ? 1 : 0,
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
 */
export async function fetchUrlByShortcode(shortcode: string, env: Env): Promise<string | null> {
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

		if (result && typeof result === 'object' && 'target_url' in result) {
			const targetUrl = result.target_url as string;

			// Special handling for 19102- prefixed shortcodes
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
 * Save a deletion entry to the database
 */
export async function saveDeletionEntry(env: Env, shortcode: string, deleteTimestamp: number, isFile: boolean): Promise<void> {
	try {
		// Insert the deletion entry
		await env.DB.prepare(
			`INSERT INTO deletions (shortcode, delete_at, is_file, created_at)
      VALUES (?, ?, ?, ?)`
		)
			.bind(shortcode, deleteTimestamp, isFile ? 1 : 0, new Date().toISOString())
			.run();

		console.log(`Saved deletion entry: ${shortcode}, delete at: ${new Date(deleteTimestamp).toISOString()}`);
	} catch (error) {
		console.error('Error saving deletion entry:', error);
		throw error;
	}
}

/**
 * Check if a shortcode is password protected
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
 */
export async function verifyShortcodePassword(shortcode: string, password: string, env: Env): Promise<boolean> {
	try {
		const result = await env.DB.prepare(`SELECT password_hash FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

		if (result && typeof result === 'object' && 'password_hash' in result && result.password_hash) {
			// Compare the provided password with the stored hash
			// In a real implementation, you would use a proper password hashing library
			// For simplicity, we're just comparing the hashed values directly
			const hashedPassword = await hashPassword(password);
			return hashedPassword === result.password_hash;
		}

		return false;
	} catch (error) {
		console.error('Error verifying shortcode password:', error);
		return false;
	}
}

/**
 * Hash a password
 * In a real implementation, you would use a proper password hashing library
 * For simplicity, we're just using a basic hash function
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
 * Track a view in the analytics table with minimal data
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
