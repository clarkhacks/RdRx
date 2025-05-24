import { renderPageLayout } from '../layouts/PageLayout';
import { renderAnalyticsListUI, type PaginationResult, type UrlAnalytics } from '../ui/AnalyticsListUI';
import { Env } from '../../types';

/**
 * Renders the analytics list page
 */
async function renderAnalyticsListPage(env: Env, userId: string, request: Request): Promise<Response> {
	// Parse pagination parameters from URL
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const itemsPerPage = parseInt(url.searchParams.get('perPage') || '10', 10);

	// Validate and sanitize pagination parameters
	const validPerPage = [10, 20, 100];
	const sanitizedPerPage = validPerPage.includes(itemsPerPage) ? itemsPerPage : 10;
	const sanitizedPage = page > 0 ? page : 1;

	// Fetch URLs with pagination
	const paginatedUrls = await getUserUrls(env, userId, sanitizedPage, sanitizedPerPage);

	// Render the analytics list UI
	const pageContent = renderAnalyticsListUI(paginatedUrls, sanitizedPage, sanitizedPerPage);

	// Use the PageLayout component to create the complete HTML document
	const html = renderPageLayout({
		title: 'Your Analytics',
		activeNavItem: 'analytics',
		content: pageContent,
	});

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Fetches paginated URLs from the database
 */
async function getUserUrls(env: Env, userId: string, page: number = 1, itemsPerPage: number = 10): Promise<PaginationResult<UrlAnalytics>> {
	try {
		// Get total count for pagination
		const countResult = await env.DB.prepare(`SELECT COUNT(*) as count FROM short_urls WHERE creator_id = ?`).bind(userId).first();

		const totalItems = Number(countResult?.count || 0);
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		const offset = (page - 1) * itemsPerPage;

		// Get paginated URLs with click counts in a single query
		const urlsResult = await env.DB.prepare(
			`
			SELECT 
				s.shortcode, 
				s.target_url, 
				s.created_at, 
				s.is_snippet, 
				s.is_file,
				COUNT(a.id) as clicks
			FROM short_urls s
			LEFT JOIN analytics a ON s.shortcode = a.shortcode
			WHERE s.creator_id = ?
			GROUP BY s.shortcode
			ORDER BY s.created_at DESC
			LIMIT ? OFFSET ?
		`,
		)
			.bind(userId, itemsPerPage, offset)
			.all();

		const urls = urlsResult?.results || [];

		// Map the results to the UrlAnalytics interface
		const urlsWithClicks: UrlAnalytics[] = urls.map((url) => ({
			shortcode: url.shortcode as string,
			target_url: url.target_url as string,
			created_at: url.created_at as string,
			is_snippet: Number(url.is_snippet) as number,
			is_file: Number(url.is_file) as number,
			clicks: Number(url.clicks || 0),
		}));

		return {
			items: urlsWithClicks,
			totalItems,
			totalPages,
			currentPage: page,
			itemsPerPage,
		};
	} catch (error) {
		console.error('Error fetching user URLs:', error);
		return {
			items: [],
			totalItems: 0,
			totalPages: 0,
			currentPage: page,
			itemsPerPage,
		};
	}
}

export { renderAnalyticsListPage };
