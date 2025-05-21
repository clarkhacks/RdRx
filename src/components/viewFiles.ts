import { renderPageLayout } from './layouts/PublicPage';
import { renderFileListUI } from './ui/FileListUI';

/**
 * Renders the view files page with the file list
 */
function renderViewFiles(fileUrls: string[], shortcode: string): Response {
	// Get the file list content from the UI component
	const content = renderFileListUI(fileUrls, shortcode);

	// Use the page layout to create the complete HTML document
	const html = renderPageLayout({
		title: `Files: ${shortcode}`,
		content,
	});

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

export { renderViewFiles };
