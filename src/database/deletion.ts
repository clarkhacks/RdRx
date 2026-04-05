import { Env } from '../types';
import { deleteUrlByShortcode } from './urls';

/**
 * Deletion entry structure
 */
export interface DeletionEntry {
	id: number;
	shortcode: string;
	delete_at: number;
	is_file: number;
	created_at: string;
}

/**
 * Save a deletion entry to the database
 * 
 * Schedules a shortcode for automatic deletion at a specified time.
 * Used for temporary URLs and files that should be automatically cleaned up.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param shortcode - The shortcode to schedule for deletion
 * @param deleteTimestamp - Unix timestamp (milliseconds) when deletion should occur
 * @param isFile - Whether this is a file shortcode (requires R2 cleanup)
 * @returns Promise that resolves when the deletion entry is saved
 * 
 * @throws {Error} When database insertion fails
 * 
 * @example
 * // Schedule deletion in 24 hours
 * const deleteAt = Date.now() + (24 * 60 * 60 * 1000);
 * await saveDeletionEntry(env, 'abc123', deleteAt, false);
 * 
 * @remarks
 * Deletion entries are processed by a scheduled cron job.
 * The actual deletion happens when executeScheduledDeletions() is called.
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
 * Get all deletion entries from the database
 * 
 * Retrieves all scheduled deletions, typically for processing by a cron job.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise resolving to an array of deletion entries
 * 
 * @example
 * const entries = await getDeletionEntries(env);
 * console.log(`${entries.length} deletions scheduled`);
 * 
 * @remarks
 * Returns an empty array if no deletions are scheduled or on error.
 * Results include both pending and overdue deletions.
 */
export async function getDeletionEntries(env: Env): Promise<DeletionEntry[]> {
	try {
		const result = await env.DB.prepare(`SELECT * FROM deletions ORDER BY delete_at ASC`).all();

		if (result && result.results) {
			return result.results as unknown as DeletionEntry[];
		}

		return [];
	} catch (error) {
		console.error('Error getting deletion entries:', error);
		return [];
	}
}

/**
 * Delete a deletion entry from the database
 * 
 * Removes a scheduled deletion entry, typically after the deletion has been executed.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @param shortcode - The shortcode whose deletion entry should be removed
 * @returns Promise that resolves when the entry is deleted
 * 
 * @throws {Error} When database deletion fails
 * 
 * @example
 * await deleteDeletionEntry(env, 'abc123');
 * console.log('Deletion entry removed');
 * 
 * @remarks
 * This only removes the deletion schedule, not the shortcode itself.
 * Use deleteUrlByShortcode() to remove the actual shortcode.
 */
export async function deleteDeletionEntry(env: Env, shortcode: string): Promise<void> {
	try {
		await env.DB.prepare(`DELETE FROM deletions WHERE shortcode = ?`).bind(shortcode).run();
		console.log(`Deleted deletion entry: ${shortcode}`);
	} catch (error) {
		console.error('Error deleting deletion entry:', error);
		throw error;
	}
}

/**
 * Execute scheduled deletions
 * 
 * Processes all deletion entries whose scheduled time has passed.
 * Deletes the shortcodes from the database and R2 (for files), then removes the deletion entries.
 * 
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise that resolves when all scheduled deletions are processed
 * 
 * @example
 * // Called by cron trigger
 * await executeScheduledDeletions(env);
 * 
 * @remarks
 * This function should be called periodically by a cron job.
 * It processes all deletions whose delete_at timestamp is in the past.
 * For file shortcodes (is_file = 1), it also deletes the file from R2 storage.
 * Errors during individual deletions are logged but don't stop processing of other entries.
 */
export async function executeScheduledDeletions(env: Env): Promise<void> {
	try {
		const now = Date.now();
		const entries = await getDeletionEntries(env);

		for (const entry of entries) {
			if (entry.delete_at <= now) {
				try {
					// Delete from R2 if it's a file
					if (entry.is_file === 1) {
						await env.R2_RDRX.delete(entry.shortcode);
						console.log(`Deleted file from R2: ${entry.shortcode}`);
					}

					// Delete the shortcode from database
					await deleteUrlByShortcode(entry.shortcode, env);

					// Delete the deletion entry
					await deleteDeletionEntry(env, entry.shortcode);

					console.log(`Executed scheduled deletion: ${entry.shortcode}`);
				} catch (error) {
					console.error(`Error executing deletion for ${entry.shortcode}:`, error);
					// Continue processing other entries even if one fails
				}
			}
		}
	} catch (error) {
		console.error('Error executing scheduled deletions:', error);
		throw error;
	}
}
