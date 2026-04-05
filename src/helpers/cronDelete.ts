import { Env } from '../types';
import { executeScheduledDeletions } from '../database';

const cronDelete = async (env: Env) => {
	const now = new Date().getTime();

	try {
		// First, handle KV temporary URLs
		await handleKVDeletions(env, now);

		// Then handle D1 deletions using the new database module
		await executeScheduledDeletions(env);
	} catch (error) {
		console.error('Error in cronDelete:', error);
	}
};

/**
 * Handle KV temporary URL deletions
 */
async function handleKVDeletions(env: Env, now: number): Promise<void> {
	try {
		// List all KV keys with the delete-short: prefix
		const kvDeleteEntries = await env.KV_RDRX.list({ prefix: 'delete-short:' });

		if (!kvDeleteEntries.keys || kvDeleteEntries.keys.length === 0) {
			console.log('No entries to delete in KV');
			return;
		}

		console.log(`Found ${kvDeleteEntries.keys.length} potential entries to check in KV`);

		// Process each KV deletion entry
		for (const entry of kvDeleteEntries.keys) {
			try {
				const shortcode = entry.name.replace('delete-short:', '');
				const expirationTimestampStr = await env.KV_RDRX.get(entry.name);

				if (!expirationTimestampStr) {
					console.warn(`No expiration timestamp found for KV entry: ${entry.name}`);
					continue;
				}

				const expirationTimestamp = parseInt(expirationTimestampStr, 10);

				// Check if the entry is due for deletion
				if (expirationTimestamp < now) {
					console.log(`Processing KV deletion for shortcode: ${shortcode}, expired at: ${new Date(expirationTimestamp).toISOString()}`);

					// Delete the URL entry
					await env.KV_RDRX.delete(`short:${shortcode}`);
					console.log(`Deleted KV URL entry for: ${shortcode}`);

					// Delete the deletion entry itself
					await env.KV_RDRX.delete(entry.name);
					console.log(`Deleted KV deletion entry for: ${shortcode}`);
				}
			} catch (error) {
				console.error(`Error processing KV deletion for ${entry.name}:`, error);
				// Continue with next entry even if there's an error
			}
		}
	} catch (error) {
		console.error('Error handling KV deletions:', error);
	}
}

export default cronDelete;
