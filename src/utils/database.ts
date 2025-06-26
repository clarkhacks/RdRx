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
        is_bio BOOLEAN NOT NULL DEFAULT 0,
        password_hash TEXT,
        is_password_protected BOOLEAN NOT NULL DEFAULT 0
      )`
		).run();

		// Create bio_links table for storing individual links within bio pages
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS bio_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bio_shortcode TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        icon TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (bio_shortcode) REFERENCES short_urls(shortcode)
      )`
		).run();

		// Create bio_pages table for storing bio page metadata
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS bio_pages (
        shortcode TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        profile_picture_url TEXT,
        theme TEXT DEFAULT 'default',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (shortcode) REFERENCES short_urls(shortcode)
      )`
		).run();

		// Create bio_social_media table for storing social media links
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS bio_social_media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bio_shortcode TEXT NOT NULL,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (bio_shortcode) REFERENCES short_urls(shortcode)
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

/**
 * Check if shortcode is available for bio page (not used by another user)
 */
export async function isBioShortcodeAvailable(env: Env, shortcode: string, userId: string): Promise<boolean> {
	try {
		const result = await env.DB.prepare(`SELECT creator_id, is_bio FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();

		// Available if doesn't exist or belongs to the same user
		// For bio pages, we need to ensure the shortcode is not used for other types of content
		if (!result) {
			return true; // Shortcode doesn't exist, so it's available
		}

		if (result.creator_id === userId) {
			// If it belongs to the same user, make sure it's a bio page
			return result.is_bio === 1;
		}

		return false; // Belongs to another user, so it's not available
	} catch (error) {
		console.error('Error checking bio shortcode availability:', error);
		return false;
	}
}

/**
 * Save a bio page to the database
 */
export async function saveBioPage(
	env: Env,
	userId: string,
	shortcode: string,
	title: string,
	description: string | null = null,
	profilePictureUrl: string | null = null,
	theme: string = 'default'
): Promise<void> {
	try {
		const now = new Date().toISOString();

		// Check if user already has a bio page
		const existingBio = await env.DB.prepare(`SELECT shortcode FROM short_urls WHERE creator_id = ? AND is_bio = 1`).bind(userId).first();

		if (existingBio) {
			if (existingBio.shortcode !== shortcode) {
				// User is changing their shortcode, delete old entries
				await env.DB.prepare(`DELETE FROM bio_pages WHERE shortcode = ?`).bind(existingBio.shortcode).run();
				await env.DB.prepare(`DELETE FROM bio_links WHERE bio_shortcode = ?`).bind(existingBio.shortcode).run();
				await env.DB.prepare(`DELETE FROM short_urls WHERE shortcode = ?`).bind(existingBio.shortcode).run();

				// Create new entry in short_urls table
				await saveUrlToDatabase(shortcode, `/bio-view/${shortcode}`, env, userId);
			} else {
				// User is updating their existing bio page with the same shortcode
				// Update the target_url in case it changed
				await env.DB.prepare(`UPDATE short_urls SET target_url = ? WHERE shortcode = ?`).bind(`/bio-view/${shortcode}`, shortcode).run();
			}
		} else {
			// User doesn't have a bio page yet, create a new one
			await saveUrlToDatabase(shortcode, `/bio-view/${shortcode}`, env, userId);
		}

		// Then save/update bio page
		await env.DB.prepare(
			`INSERT OR REPLACE INTO bio_pages 
			(shortcode, title, description, profile_picture_url, theme, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(shortcode, title, description, profilePictureUrl, theme, now, now)
			.run();

		// Clear existing bio links to enforce one link rule
		await env.DB.prepare(`DELETE FROM bio_links WHERE bio_shortcode = ?`).bind(shortcode).run();

		console.log(`Bio page saved: ${shortcode} for user: ${userId}`);
	} catch (error) {
		console.error('Error saving bio page:', error);
		throw error;
	}
}

/**
 * Get bio page by shortcode
 */
export async function getBioPage(env: Env, shortcode: string): Promise<any | null> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM bio_pages WHERE shortcode = ?`).bind(shortcode).first();
		return result || null;
	} catch (error) {
		console.error('Error getting bio page:', error);
		return null;
	}
}

/**
 * Get user's bio page (if they have one)
 */
export async function getUserBioPage(env: Env, userId: string): Promise<any | null> {
	try {
		const result = await env.DB.prepare(
			`SELECT bp.* FROM bio_pages bp 
			 JOIN short_urls su ON bp.shortcode = su.shortcode 
			 WHERE su.creator_id = ? AND su.is_bio = 1`
		)
			.bind(userId)
			.first();
		return result || null;
	} catch (error) {
		console.error('Error getting user bio page:', error);
		return null;
	}
}

/**
 * Save a bio link
 */
export async function saveBioLink(
	env: Env,
	bioShortcode: string,
	title: string,
	url: string,
	description: string | null = null,
	icon: string | null = null,
	orderIndex: number = 0
): Promise<void> {
	try {
		const now = new Date().toISOString();

		await env.DB.prepare(
			`INSERT INTO bio_links 
			(bio_shortcode, title, description, url, icon, order_index, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(bioShortcode, title, description, url, icon, orderIndex, now, now)
			.run();

		console.log(`Bio link saved for: ${bioShortcode}`);
	} catch (error) {
		console.error('Error saving bio link:', error);
		throw error;
	}
}

/**
 * Get bio links by shortcode
 */
export async function getBioLinks(env: Env, bioShortcode: string): Promise<any[]> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM bio_links WHERE bio_shortcode = ? AND is_active = 1 ORDER BY order_index ASC`)
			.bind(bioShortcode)
			.all();

		return result.results || [];
	} catch (error) {
		console.error('Error getting bio links:', error);
		return [];
	}
}

/**
 * Delete bio link
 */
export async function deleteBioLink(env: Env, linkId: number): Promise<void> {
	try {
		await env.DB.prepare(`DELETE FROM bio_links WHERE id = ?`).bind(linkId).run();
		console.log(`Bio link deleted: ${linkId}`);
	} catch (error) {
		console.error('Error deleting bio link:', error);
		throw error;
	}
}

/**
 * Update bio link order
 */
export async function updateBioLinkOrder(env: Env, linkId: number, newOrder: number): Promise<void> {
	try {
		const now = new Date().toISOString();
		await env.DB.prepare(`UPDATE bio_links SET order_index = ?, updated_at = ? WHERE id = ?`).bind(newOrder, now, linkId).run();

		console.log(`Bio link order updated: ${linkId} -> ${newOrder}`);
	} catch (error) {
		console.error('Error updating bio link order:', error);
		throw error;
	}
}

/**
 * Save social media links for a bio page
 */
export async function saveBioSocialMedia(env: Env, bioShortcode: string, socialMedia: Record<string, string>): Promise<void> {
	try {
		const now = new Date().toISOString();

		// Delete existing social media links for this bio page
		await env.DB.prepare(`DELETE FROM bio_social_media WHERE bio_shortcode = ?`).bind(bioShortcode).run();

		// Save new social media links
		for (const [platform, url] of Object.entries(socialMedia)) {
			if (url && url.trim()) {
				await env.DB.prepare(
					`INSERT INTO bio_social_media 
					(bio_shortcode, platform, url, created_at, updated_at)
					VALUES (?, ?, ?, ?, ?)`
				)
					.bind(bioShortcode, platform, url.trim(), now, now)
					.run();
			}
		}

		console.log(`Bio social media saved for: ${bioShortcode}`);
	} catch (error) {
		console.error('Error saving bio social media:', error);
		throw error;
	}
}

/**
 * Get social media links for a bio page
 */
export async function getBioSocialMedia(env: Env, bioShortcode: string): Promise<Record<string, string>> {
	try {
		const result = await env.DB.prepare(`SELECT platform, url FROM bio_social_media WHERE bio_shortcode = ? AND is_active = 1`)
			.bind(bioShortcode)
			.all();

		const socialMedia: Record<string, string> = {};
		if (result.results) {
			for (const row of result.results) {
				socialMedia[row.platform as string] = row.url as string;
			}
		}

		return socialMedia;
	} catch (error) {
		console.error('Error getting bio social media:', error);
		return {};
	}
}
