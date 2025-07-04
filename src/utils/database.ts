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

		// Create comprehensive bio_profiles table for storing all bio page data
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS bio_profiles (
        id TEXT PRIMARY KEY,
        short_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        profile_picture_url TEXT,
        theme TEXT DEFAULT 'default',
        bio_links TEXT,
        social_media_links TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
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
 * Save a complete bio profile to the database
 */
export async function saveBioProfile(
	env: Env,
	userId: string,
	shortcode: string,
	title: string,
	description: string | null = null,
	profilePictureUrl: string | null = null,
	theme: string = 'default',
	bioLinks: any[] = [],
	socialMediaLinks: any[] = [],
	metaTitle: string | null = null,
	metaDescription: string | null = null,
	metaTags: string | null = null,
	ogImageUrl: string | null = null
): Promise<void> {
	try {
		const now = new Date().toISOString();

		// Check if user already has a bio page
		const existingBio = await env.DB.prepare(`SELECT shortcode FROM short_urls WHERE creator_id = ? AND is_bio = 1`).bind(userId).first();

		if (existingBio) {
			if (existingBio.shortcode !== shortcode) {
				// User is changing their shortcode, just delete the old redirect and create new one
				await env.DB.prepare(`DELETE FROM short_urls WHERE shortcode = ?`).bind(existingBio.shortcode).run();
				// Create new entry in short_urls table with new shortcode
				await saveUrlToDatabase(shortcode, `/bio-view/${userId}`, env, userId);
			} else {
				// User is updating their existing bio page with the same shortcode
				// Update the target_url to ensure it points to their user ID
				await env.DB.prepare(`UPDATE short_urls SET target_url = ? WHERE shortcode = ?`).bind(`/bio-view/${userId}`, shortcode).run();
			}
		} else {
			// User doesn't have a bio page yet, create a new one
			await saveUrlToDatabase(shortcode, `/bio-view/${userId}`, env, userId);
		}

		// Save/update bio profile using userId as the key
		await env.DB.prepare(
			`INSERT OR REPLACE INTO bio_profiles 
			(id, short_id, title, description, profile_picture_url, theme, bio_links, social_media_links, meta_title, meta_description, meta_tags, og_image_url, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				userId, 
				shortcode, 
				title, 
				description, 
				profilePictureUrl, 
				theme, 
				JSON.stringify(bioLinks), 
				JSON.stringify(socialMediaLinks), 
				metaTitle,
				metaDescription,
				metaTags,
				ogImageUrl,
				now, 
				now
			)
			.run();

		console.log(`Bio profile saved: ${shortcode} for user: ${userId}`);
	} catch (error) {
		console.error('Error saving bio profile:', error);
		throw error;
	}
}

/**
 * Get bio profile by user ID
 */
export async function getBioProfile(env: Env, userId: string): Promise<any | null> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM bio_profiles WHERE id = ?`).bind(userId).first();
		
		if (result) {
			// Parse JSON fields
			const profile = {
				...result,
				bio_links: result.bio_links ? JSON.parse(result.bio_links as string) : [],
				social_media_links: result.social_media_links ? JSON.parse(result.social_media_links as string) : []
			};
			return profile;
		}
		
		return null;
	} catch (error) {
		console.error('Error getting bio profile:', error);
		return null;
	}
}

/**
 * Get user's bio page (if they have one) - for compatibility
 */
export async function getUserBioPage(env: Env, userId: string): Promise<any | null> {
	try {
		const profile = await getBioProfile(env, userId);
		if (!profile) return null;

		// Return in the old format for compatibility
		return {
			shortcode: profile.short_id,
			title: profile.title,
			description: profile.description,
			profile_picture_url: profile.profile_picture_url,
			theme: profile.theme,
			created_at: profile.created_at,
			updated_at: profile.updated_at
		};
	} catch (error) {
		console.error('Error getting user bio page:', error);
		return null;
	}
}

/**
 * Get bio page by shortcode - for viewing
 */
export async function getBioPage(env: Env, shortcode: string): Promise<any | null> {
	try {
		// Check if this is a direct bio-view URL (shortcode is actually a user ID)
		if (shortcode.includes('-') && shortcode.length > 20) {
			// This looks like a user ID, get the bio profile directly
			const profile = await getBioProfile(env, shortcode);
			if (!profile) return null;

			// Return with meta fields included
			return {
				shortcode: profile.short_id,
				title: profile.title,
				description: profile.description,
				profile_picture_url: profile.profile_picture_url,
				theme: profile.theme,
				meta_title: profile.meta_title,
				meta_description: profile.meta_description,
				meta_tags: profile.meta_tags,
				og_image_url: profile.og_image_url,
				created_at: profile.created_at,
				updated_at: profile.updated_at
			};
		}

		// Otherwise, get the user ID from the shortcode redirect
		const shortUrlResult = await env.DB.prepare(`SELECT creator_id FROM short_urls WHERE shortcode = ? AND is_bio = 1`).bind(shortcode).first();
		
		if (!shortUrlResult || !shortUrlResult.creator_id) {
			return null;
		}

		// Then get the bio profile using the user ID
		const profile = await getBioProfile(env, shortUrlResult.creator_id as string);
		if (!profile) return null;

		// Return with meta fields included
		return {
			shortcode: profile.short_id,
			title: profile.title,
			description: profile.description,
			profile_picture_url: profile.profile_picture_url,
			theme: profile.theme,
			meta_title: profile.meta_title,
			meta_description: profile.meta_description,
			meta_tags: profile.meta_tags,
			og_image_url: profile.og_image_url,
			created_at: profile.created_at,
			updated_at: profile.updated_at
		};
	} catch (error) {
		console.error('Error getting bio page:', error);
		return null;
	}
}

/**
 * Get bio links - for compatibility
 */
export async function getBioLinks(env: Env, userId: string): Promise<any[]> {
	try {
		const profile = await getBioProfile(env, userId);
		return profile ? profile.bio_links : [];
	} catch (error) {
		console.error('Error getting bio links:', error);
		return [];
	}
}

/**
 * Get social media links - for compatibility
 */
export async function getBioSocialMedia(env: Env, userId: string): Promise<Record<string, any>> {
	try {
		const profile = await getBioProfile(env, userId);
		if (!profile || !profile.social_media_links) return {};

		// Convert array back to object format for compatibility
		const socialMedia: Record<string, any> = {};
		profile.social_media_links.forEach((link: any) => {
			if (link.platform && link.url) {
				socialMedia[link.platform] = {
					url: link.url,
					icon: link.icon || ''
				};
			}
		});

		return socialMedia;
	} catch (error) {
		console.error('Error getting bio social media:', error);
		return {};
	}
}

// Legacy functions for compatibility
export async function saveBioPage(
	env: Env,
	userId: string,
	shortcode: string,
	title: string,
	description: string | null = null,
	profilePictureUrl: string | null = null,
	theme: string = 'default'
): Promise<void> {
	// Get existing profile to preserve links
	const existingProfile = await getBioProfile(env, userId);
	const bioLinks = existingProfile ? existingProfile.bio_links : [];
	const socialMediaLinks = existingProfile ? existingProfile.social_media_links : [];
	
	return saveBioProfile(env, userId, shortcode, title, description, profilePictureUrl, theme, bioLinks, socialMediaLinks);
}

export async function saveBioLink(
	env: Env,
	userId: string,
	title: string,
	url: string,
	description: string | null = null,
	icon: string | null = null,
	orderIndex: number = 0
): Promise<void> {
	// This function is now handled by saveBioProfile with the links array
	console.log(`Bio link save called for user: ${userId} - use saveBioProfile instead`);
}

export async function saveBioSocialMedia(env: Env, userId: string, socialMedia: Record<string, any>): Promise<void> {
	// This function is now handled by saveBioProfile with the social media array
	console.log(`Bio social media save called for user: ${userId} - use saveBioProfile instead`);
}

export async function deleteBioLink(env: Env, linkId: number): Promise<void> {
	console.log(`Bio link delete called for ID: ${linkId} - use saveBioProfile instead`);
}

export async function updateBioLinkOrder(env: Env, linkId: number, newOrder: number): Promise<void> {
	console.log(`Bio link order update called for ID: ${linkId} - use saveBioProfile instead`);
}
