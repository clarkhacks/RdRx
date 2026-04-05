import { Env } from '../types';
import { saveUrlToDatabase } from './urls';

/**
 * Bio profile structure
 */
export interface BioProfile {
	id: string;
	short_id: string;
	title: string;
	description: string | null;
	profile_picture_url: string | null;
	theme: string;
	bio_links: any[];
	social_media_links: any[];
	meta_title: string | null;
	meta_description: string | null;
	meta_tags: string | null;
	og_image_url: string | null;
	created_at: string;
	updated_at: string;
}

/**
 * Check if shortcode is available for bio page
 * 
 * Verifies that a shortcode is not already in use by another user.
 * Allows the same user to reuse their own bio shortcode.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param shortcode - The shortcode to check
 * @param userId - The user ID requesting the shortcode
 * @returns Promise resolving to true if available, false otherwise
 * 
 * @example
 * const available = await isBioShortcodeAvailable(env, 'john', userId);
 * if (!available) {
 *   console.log('Shortcode already taken');
 * }
 * 
 * @remarks
 * A shortcode is available if:
 * - It doesn't exist in the database, OR
 * - It belongs to the same user AND is marked as a bio page
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
 * 
 * Creates or updates a user's bio profile with all associated data.
 * Handles shortcode changes and ensures proper URL redirects.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param userId - The user ID who owns the bio profile
 * @param shortcode - The custom shortcode for the bio page
 * @param title - The bio page title
 * @param description - Optional bio description
 * @param profilePictureUrl - Optional profile picture URL
 * @param theme - Theme name (default: 'default')
 * @param bioLinks - Array of bio links to display
 * @param socialMediaLinks - Array of social media links
 * @param metaTitle - Optional custom meta title for SEO
 * @param metaDescription - Optional meta description for SEO
 * @param metaTags - Optional additional meta tags
 * @param ogImageUrl - Optional Open Graph image URL
 * @returns Promise that resolves when the profile is saved
 * 
 * @throws {Error} When database operations fail
 * 
 * @example
 * await saveBioProfile(
 *   env,
 *   userId,
 *   'john',
 *   'John Doe',
 *   'Software Developer',
 *   'https://example.com/photo.jpg',
 *   'default',
 *   [{ title: 'Website', url: 'https://example.com' }],
 *   [{ platform: 'twitter', url: 'https://twitter.com/john' }]
 * );
 * 
 * @remarks
 * - If user changes their shortcode, the old one is deleted
 * - Bio profiles are stored with userId as the primary key
 * - Links are stored as JSON strings in the database
 * - Creates a redirect from shortcode to /bio-view/{userId}
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
 * 
 * Retrieves a user's bio profile data with parsed JSON fields.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param userId - The user ID to get the profile for
 * @returns Promise resolving to the bio profile or null if not found
 * 
 * @example
 * const profile = await getBioProfile(env, userId);
 * if (profile) {
 *   console.log(profile.title, profile.bio_links);
 * }
 * 
 * @remarks
 * JSON fields (bio_links, social_media_links) are automatically parsed.
 * Returns null if the profile doesn't exist or on error.
 */
export async function getBioProfile(env: Env, userId: string): Promise<BioProfile | null> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM bio_profiles WHERE id = ?`).bind(userId).first();

		if (result) {
			// Parse JSON fields
			const profile: BioProfile = {
				...(result as any),
				bio_links: result.bio_links ? JSON.parse(result.bio_links as string) : [],
				social_media_links: result.social_media_links ? JSON.parse(result.social_media_links as string) : [],
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
 * Get user's bio page (if they have one)
 * 
 * Compatibility function that returns bio data in a simplified format.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param userId - The user ID to get the bio page for
 * @returns Promise resolving to simplified bio data or null
 * 
 * @deprecated Use getBioProfile instead for full profile data
 * 
 * @remarks
 * This function exists for backward compatibility.
 * Returns a subset of the full profile data.
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
			updated_at: profile.updated_at,
		};
	} catch (error) {
		console.error('Error getting user bio page:', error);
		return null;
	}
}

/**
 * Get bio page by shortcode - for viewing
 * 
 * Retrieves bio profile data for display, supporting both shortcode and direct user ID access.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param shortcode - The shortcode or user ID to look up
 * @returns Promise resolving to bio page data or null
 * 
 * @example
 * const bioPage = await getBioPage(env, 'john');
 * if (bioPage) {
 *   // Render bio page
 * }
 * 
 * @remarks
 * Supports two access patterns:
 * 1. Direct user ID (contains '-' and length > 20) - looks up profile directly
 * 2. Shortcode - looks up redirect, then gets profile by user ID
 * 
 * Returns profile data with meta fields for SEO.
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
				bio_links: profile.bio_links,
				social_media_links: profile.social_media_links,
				meta_title: profile.meta_title,
				meta_description: profile.meta_description,
				meta_tags: profile.meta_tags,
				og_image_url: profile.og_image_url,
				created_at: profile.created_at,
				updated_at: profile.updated_at,
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
			bio_links: profile.bio_links,
			social_media_links: profile.social_media_links,
			meta_title: profile.meta_title,
			meta_description: profile.meta_description,
			meta_tags: profile.meta_tags,
			og_image_url: profile.og_image_url,
			created_at: profile.created_at,
			updated_at: profile.updated_at,
		};
	} catch (error) {
		console.error('Error getting bio page:', error);
		return null;
	}
}

/**
 * Get bio links - for compatibility
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param userId - The user ID to get links for
 * @returns Promise resolving to array of bio links
 * 
 * @deprecated Use getBioProfile instead and access bio_links property
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
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param userId - The user ID to get social media links for
 * @returns Promise resolving to social media links object
 * 
 * @deprecated Use getBioProfile instead and access social_media_links property
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
					icon: link.icon || '',
				};
			}
		});

		return socialMedia;
	} catch (error) {
		console.error('Error getting bio social media:', error);
		return {};
	}
}

/**
 * Update bio profile
 * 
 * Updates an existing bio profile with new data.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param userId - The user ID whose profile to update
 * @param data - Partial profile data to update
 * @returns Promise that resolves when update is complete
 * 
 * @throws {Error} When update fails or profile doesn't exist
 * 
 * @example
 * await updateBioProfile(env, userId, {
 *   title: 'New Title',
 *   description: 'Updated description'
 * });
 * 
 * @remarks
 * This is a convenience function that fetches the existing profile,
 * merges the new data, and saves it back.
 */
export async function updateBioProfile(env: Env, userId: string, data: Partial<BioProfile>): Promise<void> {
	try {
		const existingProfile = await getBioProfile(env, userId);
		if (!existingProfile) {
			throw new Error('Bio profile not found');
		}

		// Merge existing data with updates
		await saveBioProfile(
			env,
			userId,
			data.short_id || existingProfile.short_id,
			data.title || existingProfile.title,
			data.description !== undefined ? data.description : existingProfile.description,
			data.profile_picture_url !== undefined ? data.profile_picture_url : existingProfile.profile_picture_url,
			data.theme || existingProfile.theme,
			data.bio_links || existingProfile.bio_links,
			data.social_media_links || existingProfile.social_media_links,
			data.meta_title !== undefined ? data.meta_title : existingProfile.meta_title,
			data.meta_description !== undefined ? data.meta_description : existingProfile.meta_description,
			data.meta_tags !== undefined ? data.meta_tags : existingProfile.meta_tags,
			data.og_image_url !== undefined ? data.og_image_url : existingProfile.og_image_url
		);
	} catch (error) {
		console.error('Error updating bio profile:', error);
		throw error;
	}
}

/**
 * Delete bio profile
 * 
 * Removes a user's bio profile and associated shortcode redirect.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param userId - The user ID whose profile to delete
 * @returns Promise that resolves when deletion is complete
 * 
 * @throws {Error} When deletion fails
 * 
 * @example
 * await deleteBioProfile(env, userId);
 * console.log('Bio profile deleted');
 * 
 * @remarks
 * Deletes both the bio_profiles entry and the shortcode redirect.
 * This operation cannot be undone.
 */
export async function deleteBioProfile(env: Env, userId: string): Promise<void> {
	try {
		// Delete the bio profile
		await env.DB.prepare(`DELETE FROM bio_profiles WHERE id = ?`).bind(userId).run();

		// Delete the shortcode redirect
		await env.DB.prepare(`DELETE FROM short_urls WHERE creator_id = ? AND is_bio = 1`).bind(userId).run();

		console.log(`Deleted bio profile for user: ${userId}`);
	} catch (error) {
		console.error('Error deleting bio profile:', error);
		throw error;
	}
}
