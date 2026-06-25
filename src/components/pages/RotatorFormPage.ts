import { Env } from '../../types';
import { renderPageLayout } from '../layouts/PageLayout';
import { renderRotatorFormUI, renderRotatorFormScripts } from '../ui/RotatorFormUI';

/**
 * Render the rotator form page
 */
export function renderRotatorFormPage(request: Request, env: Env): Response {
	const shortDomain = env.SHORT_DOMAIN || 'rdrx.co';

	const content = `
    ${renderRotatorFormUI({ shortDomain })}
    <script>
      ${renderRotatorFormScripts(shortDomain)}
    </script>
  `;

	const html = renderPageLayout({
		title: 'Create A/B Test Link - RdRx',
		content,
		user: request.user,
	});

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}
