import { renderPageLayout } from '../layouts/PageLayout';
import {
	renderAnalyticsOverview,
	renderAnalyticsCharts,
	renderAnalyticsChartsScripts,
	renderAnalyticsRecentVisits,
	type AnalyticsData,
} from '../ui/AnalyticsUI';

interface Env {
	DB: D1Database;
}

async function renderAnalyticsPage(shortcode: string, env: Env): Promise<Response> {
	// Get the target URL from D1 database
	let targetUrl = '';
	try {
		const result = await env.DB.prepare(`SELECT target_url FROM short_urls WHERE shortcode = ?`).bind(shortcode).first();
		if (result && result.target_url) {
			targetUrl = String(result.target_url);
		}
	} catch (error) {
		console.error('Error fetching shortcode from D1:', error);
	}

	if (!targetUrl) {
		return new Response('Short URL not found', { status: 404 });
	}

	// Fetch analytics data from D1
	const analyticsData = await getAnalyticsData(shortcode, env);

	// Assemble the page content from UI components
	const pageContent = `
    <div class="bg-white shadow-notion p-6 md:p-8 mb-8 max-w-6xl mx-auto notion-card">
      ${renderAnalyticsOverview({ analyticsData, shortcode, targetUrl })}
      ${renderAnalyticsCharts({ analyticsData })}
      ${renderAnalyticsRecentVisits({ analyticsData })}
    </div>
  `;

	// Add Chart.js script to the document head
	const additionalHeadScripts = `
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
  `;

	// Render the complete page
	const html = renderPageLayout({
		title: `Analytics for ${shortcode}`,
		activeNavItem: 'analytics',
		content: pageContent,
		scripts: renderAnalyticsChartsScripts(analyticsData),
		additionalHeadScripts,
	});

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

async function getAnalyticsData(shortcode: string, env: Env): Promise<AnalyticsData> {
	// Get total visits
	const totalVisitsResult = await env.DB.prepare(`SELECT COUNT(*) as count FROM analytics WHERE shortcode = ?`).bind(shortcode).first();
	const visits = totalVisitsResult?.count ? Number(totalVisitsResult.count) : 0;

	// Get visits by date
	const viewsByDateResult = await env.DB.prepare(
		`SELECT 
            DATE(timestamp) as date, 
            COUNT(*) as count 
        FROM analytics 
        WHERE shortcode = ? 
        GROUP BY DATE(timestamp) 
        ORDER BY date DESC
        LIMIT 30`
	)
		.bind(shortcode)
		.all();
	const views_by_date = (viewsByDateResult?.results || []).map((item) => ({
		date: String(item.date || ''),
		count: Number(item.count || 0),
	}));

	// Get visits by country
	const viewsByCountryResult = await env.DB.prepare(
		`SELECT 
            country, 
            COUNT(*) as count 
        FROM analytics 
        WHERE shortcode = ? 
        GROUP BY country 
        ORDER BY count DESC
        LIMIT 10`
	)
		.bind(shortcode)
		.all();
	const views_by_country = (viewsByCountryResult?.results || []).map((item) => ({
		country: String(item.country || 'Unknown'),
		count: Number(item.count || 0),
	}));

	// Recent visits
	const recentVisitsResult = await env.DB.prepare(
		`SELECT 
            timestamp, 
            country
        FROM analytics 
        WHERE shortcode = ? 
        ORDER BY timestamp DESC
        LIMIT 20`
	)
		.bind(shortcode)
		.all();
	const recent_visits = (recentVisitsResult?.results || []).map((item) => ({
		timestamp: String(item.timestamp || ''),
		country: String(item.country || 'Unknown'),
	}));

	return {
		visits,
		views_by_date,
		views_by_country,
		recent_visits,
	};
}

export { renderAnalyticsPage };
