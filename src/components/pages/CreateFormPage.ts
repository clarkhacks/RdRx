import { renderPageLayout } from '../layouts/PageLayout';
import { renderSuccessAlert } from '../ui/SuccessAlert';
import { renderCreateFormUI, renderCreateFormScripts } from '../ui/CreateFormUI';

interface Env {}

function renderCreateFormPage(env: Env, shortcodeValue?: string, shortcode?: string): Response {
	const pageContent = `
    ${renderSuccessAlert({ message: '' })}
    ${renderCreateFormUI({ shortcode, shortcodeValue })}
  `;

	const html = renderPageLayout({
		title: 'Create Short URL',
		activeNavItem: 'create',
		content: pageContent,
		scripts: renderCreateFormScripts(),
	});

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

export { renderCreateFormPage };
