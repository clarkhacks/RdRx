import { renderPageLayout } from '../layouts/PageLayout';
import { renderBioFormUI, renderBioFormScripts } from '../ui/BioFormUI';

interface Env {
	SHORT_DOMAIN: string;
}

function renderBioFormPage(env: Env, shortcode?: string, shortcodeValue?: string): Response {
	const shortDomain = env.SHORT_DOMAIN;
	
	// Assemble the content
	const content = renderBioFormUI({ shortcode, shortcodeValue, shortDomain });

	// Render the complete page using the layout
	const html = renderPageLayout({
		title: 'Create Bio Page',
		activeNavItem: 'bio',
		content,
		scripts: renderBioFormScripts(shortDomain),
	});

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

export { renderBioFormPage };
