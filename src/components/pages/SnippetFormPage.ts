import { renderPageLayout } from '../layouts/PageLayout';
import { renderSnippetFormUI, renderSnippetFormScripts } from '../ui/SnippetFormUI';

interface Env {
	SHORT_DOMAIN: string;
}

function renderSnippetFormPage(env: Env, shortcode?: string, shortcodeValue?: string): Response {
	const shortDomain = env.SHORT_DOMAIN;
	
	// Assemble the content
	const content = renderSnippetFormUI({ shortcode, shortcodeValue, shortDomain });

	// Render the complete page using the layout
	const html = renderPageLayout({
		title: 'Create Code Snippet',
		activeNavItem: 'snippet',
		content,
		scripts: renderSnippetFormScripts(shortDomain),
	});

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

export { renderSnippetFormPage };
