import { renderPageLayout } from '../layouts/PageLayout';
import { renderSuccessAlert } from '../ui/SuccessAlert';
import { renderCreateFormUI, renderCreateFormScripts } from '../ui/CreateFormUI';

// Extend the Request type to include the user property
declare global {
	interface Request {
		user?: {
			uid: string;
			[key: string]: any;
		};
	}
}

interface Env {
	ADMIN_UID?: string;
}

function renderCreateFormPage(request: Request, env: Env, shortcodeValue?: string, shortcode?: string): Response {
	// Check if the user is an admin
	const isAdmin = request.user?.uid === env.ADMIN_UID;

	const pageContent = `
    ${renderSuccessAlert({ message: '' })}
    ${renderCreateFormUI({ shortcode, shortcodeValue, isAdmin })}
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
