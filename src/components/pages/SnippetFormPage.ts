import { renderPageLayout } from '../layouts/PageLayout';
import { renderSnippetFormUI, renderSnippetFormScripts } from '../ui/SnippetFormUI';

interface Env {
	CLERK_PUBLISHABLE_KEY: string;
}

function renderSnippetFormPage(env: Env, shortcode?: string, shortcodeValue?: string): Response {
	// Assemble the content
	const content = renderSnippetFormUI({ shortcode, shortcodeValue });

	// Render the complete page using the layout
	const html = renderPageLayout({
		title: 'Create Code Snippet',
		clerkPublishableKey: env.CLERK_PUBLISHABLE_KEY,
		activeNavItem: 'snippet',
		content,
		scripts: renderSnippetFormScripts(),
	});

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

export { renderSnippetFormPage };
