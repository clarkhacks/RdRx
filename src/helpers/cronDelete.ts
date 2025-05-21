import { Env } from '../types';

const cronDelete = async (env: Env) => {
	const now = new Date().getTime();

	try {
		// Get all deletion entries from D1 that are due
		const deletionEntries = await env.DB.prepare(
			`
			SELECT * FROM deletions WHERE delete_at < ?
		`,
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
				console.log(`Processing deletion for shortcode: ${shortcode}, is_file: ${is_file}`);

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
				`,
				)
					.bind(entry.id)
					.run();
				console.log(`Deleted D1 deletion entry for: ${shortcode}`);
			} catch (error) {
				console.error(`Error processing deletion for ${entry.shortcode}:`, error);
				// Continue with next entry even if there's an error
			}
		}
	} catch (error) {
		console.error('Error in cronDelete:', error);
	}
};

export default cronDelete;
