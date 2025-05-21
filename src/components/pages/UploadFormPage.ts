import { renderPageLayout } from '../layouts/PageLayout';
import { renderUploadFormUI, renderUploadFormScripts } from '../ui/UploadFormUI';
import { renderUploadModalUI, renderUploadModalScripts } from '../ui/UploadModalUI';

interface Env {
	CLERK_PUBLISHABLE_KEY: string;
}

function renderUploadFormPage(env: Env): Response {
	// Assemble the content
	const modalUI = renderUploadModalUI();
	const formUI = renderUploadFormUI();
	const content = `
		${modalUI}
		${formUI}
	`;
	
	// Combine the scripts
	const scripts = `
		${renderUploadModalScripts()}
		${renderUploadFormScripts()}
	`;
	
	// Render the complete page using the layout
	const html = renderPageLayout({
		title: 'Upload Files | RdRx',
		clerkPublishableKey: env.CLERK_PUBLISHABLE_KEY,
		activeNavItem: 'upload',
		content,
		scripts
	});
	
	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

export { renderUploadFormPage };