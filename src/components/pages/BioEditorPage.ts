import { Env } from '../../types';
import { renderDocumentHead } from '../layouts/DocumentHead';
import { renderPageLayout } from '../layouts/PageLayout';
import { renderBioEditorUI, renderBioEditorScripts } from '../ui/BioEditorUI';

/**
 * Render the bio editor page
 */
export async function renderBioEditorPage(request: Request, env: Env): Promise<Response> {
	// Check if user is authenticated
	if (!request.user) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/login?redirect_url=' + encodeURIComponent('/bio/edit'),
			},
		});
	}

	const shortDomain = env.SHORT_DOMAIN;

	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'Bio Page Editor - RDRX' })}
		<body class="bg-gray-50">
			${renderPageLayout({
				title: 'Bio Page Editor - RDRX',
				content: renderBioEditorUI({ shortDomain }),
				activeNavItem: 'bio',
			})}
			<script>
				${renderBioEditorScripts(shortDomain)}
			</script>
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}
