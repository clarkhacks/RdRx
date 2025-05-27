import { Env } from '../types';

const cronDelete = async (env: Env) => {
	const now = new Date().getTime();

	try {
		// First, handle KV temporary URLs
		await handleKVDeletions(env, now);

		// Then handle D1 deletions
		await handleD1Deletions(env, now);
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

/**
 * Handle D1 deletions
 */
async function handleD1Deletions(env: Env, now: number): Promise<void> {
	try {
		// Get all deletion entries from D1 that are due
		const deletionEntries = await env.DB.prepare(
			`
			SELECT * FROM deletions WHERE delete_at < ?
		`
		)
			.bind(now)
			.all();

		if (!deletionEntries.results || deletionEntries.results.length === 0) {
			console.log('No entries to delete in D1');
			return;
		}

		console.log(`Found ${deletionEntries.results.length} entries to delete in D1`);

		// Process each deletion entry
		for (const entry of deletionEntries.results) {
			try {
				const { shortcode, is_file } = entry as { shortcode: string; is_file: boolean };
				console.log(`Processing D1 deletion for shortcode: ${shortcode}, is_file: ${is_file}`);

				// Handle file vs regular shortcode
				const actualShortcode = is_file ? `f-${shortcode}` : shortcode;

				// If it's a file, delete associated files from R2
				if (is_file) {
					const files = await env.R2_RDRX.list({ prefix: shortcode });
					if (files.objects && files.objects.length > 0) {
						for (const file of files.objects) {
							await env.R2_RDRX.delete(file.key);
							console.log(`Deleted file: ${file.key}`);
						}
					} else {
						console.warn(`No files found for prefix: ${shortcode}`);
					}
				}

				// Delete the entry from the deletions table
				await env.DB.prepare(
					`
					DELETE FROM deletions WHERE id = ?
				`
				)
					.bind(entry.id)
					.run();
				console.log(`Deleted D1 deletion entry for: ${shortcode}`);
			} catch (error) {
				console.error(`Error processing D1 deletion for ${entry.shortcode}:`, error);
				// Continue with next entry even if there's an error
			}
		}
	} catch (error) {
		console.error('Error handling D1 deletions:', error);
	}
}

export default cronDelete;
