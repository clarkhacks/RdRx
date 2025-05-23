import { Env } from '../../types';
import { User } from '../auth/types';
import { renderDocumentHead } from '../layouts/DocumentHead';
import { renderPageLayout } from '../layouts/PageLayout';

/**
 * Render the dashboard page
 */
export async function renderDashboardPage(request: Request, env: Env): Promise<Response> {
	// Check if user is authenticated
	if (!request.user) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/login?redirect_url=' + encodeURIComponent('/dashboard'),
			},
		});
	}

	const user = request.user;

	// Get user's recent links, snippets, and files
	const recentLinks = await getUserRecentLinks(env, user.uid);
	const recentSnippets = await getUserRecentSnippets(env, user.uid);
	const recentFiles = await getUserRecentFiles(env, user.uid);

	// Get user's analytics summary
	const analyticsSummary = await getUserAnalyticsSummary(env, user.uid);

	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'Dashboard - RDRX' })}
		<body class="bg-gray-50">
			${renderPageLayout({
				title: 'Dashboard - RDRX',
				content: renderDashboardContent(user, recentLinks, recentSnippets, recentFiles, analyticsSummary),
				activeNavItem: 'dashboard',
			})}
			<script>
				// Initialize charts
				document.addEventListener('DOMContentLoaded', function() {
					// Only initialize charts if the elements exist
					if (document.getElementById('visits-chart')) {
						renderVisitsChart();
					}
				});
				
				function renderVisitsChart() {
					const ctx = document.getElementById('visits-chart').getContext('2d');
					
					// Sample data - in production this would come from the server
					const chart = new Chart(ctx, {
						type: 'line',
						data: {
							labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday'],
							datasets: [{
								label: 'Link Visits',
								data: ${JSON.stringify(analyticsSummary.dailyVisits)},
								backgroundColor: 'rgba(14, 165, 233, 0.2)',
								borderColor: 'rgba(14, 165, 233, 1)',
								borderWidth: 2,
								tension: 0.4,
								pointBackgroundColor: 'rgba(14, 165, 233, 1)',
								pointRadius: 4
							}]
						},
						options: {
							responsive: true,
							maintainAspectRatio: false,
							scales: {
								y: {
									beginAtZero: true,
									grid: {
										color: 'rgba(0, 0, 0, 0.05)'
									}
								},
								x: {
									grid: {
										display: false
									}
								}
							},
							plugins: {
								legend: {
									display: false
								},
								tooltip: {
									backgroundColor: 'rgba(0, 0, 0, 0.7)',
									padding: 10,
									cornerRadius: 6
								}
							}
						}
					});
				}
			</script>
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Render the dashboard content
 */
function renderDashboardContent(user: User, recentLinks: any[], recentSnippets: any[], recentFiles: any[], analyticsSummary: any): string {
	const profilePicture = user.profile_picture_url || 'https://via.placeholder.com/150';

	return `
		<div class="max-w-6xl mx-auto py-8 px-4">
			<!-- Welcome Section -->
			<div class="bg-white p-6 rounded-lg shadow-md mb-8">
				<div class="flex items-center">
					<img src="${profilePicture}" alt="Profile Picture" class="w-16 h-16 rounded-full object-cover mr-4">
					<div>
						<h1 class="text-2xl font-bold">Welcome back, ${user.name}!</h1>
						<p class="text-gray-600">Here's an overview of your activity</p>
					</div>
				</div>
			</div>
			
			<!-- Stats Overview -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div class="bg-white p-6 rounded-lg shadow-md">
					<div class="flex justify-between items-start">
						<div>
							<p class="text-gray-500 text-sm">Total Links</p>
							<h2 class="text-3xl font-bold">${analyticsSummary.totalLinks}</h2>
						</div>
						<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
							<i class="fas fa-link text-blue-500"></i>
						</div>
					</div>
					<div class="mt-4">
						<span class="text-green-500 text-sm font-medium">
							<i class="fas fa-arrow-up mr-1"></i> ${analyticsSummary.linkGrowth}%
						</span>
						<span class="text-gray-500 text-sm ml-2">vs last week</span>
					</div>
				</div>
				
				<div class="bg-white p-6 rounded-lg shadow-md">
					<div class="flex justify-between items-start">
						<div>
							<p class="text-gray-500 text-sm">Total Visits</p>
							<h2 class="text-3xl font-bold">${analyticsSummary.totalVisits}</h2>
						</div>
						<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
							<i class="fas fa-chart-line text-purple-500"></i>
						</div>
					</div>
					<div class="mt-4">
						<span class="text-green-500 text-sm font-medium">
							<i class="fas fa-arrow-up mr-1"></i> ${analyticsSummary.visitGrowth}%
						</span>
						<span class="text-gray-500 text-sm ml-2">vs last week</span>
					</div>
				</div>
				
				<div class="bg-white p-6 rounded-lg shadow-md">
					<div class="flex justify-between items-start">
						<div>
							<p class="text-gray-500 text-sm">Files Shared</p>
							<h2 class="text-3xl font-bold">${analyticsSummary.totalFiles}</h2>
						</div>
						<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
							<i class="fas fa-file-alt text-green-500"></i>
						</div>
					</div>
					<div class="mt-4">
						<span class="text-green-500 text-sm font-medium">
							<i class="fas fa-arrow-up mr-1"></i> ${analyticsSummary.fileGrowth}%
						</span>
						<span class="text-gray-500 text-sm ml-2">vs last week</span>
					</div>
				</div>
			</div>
			
			<!-- Chart and Recent Activity -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
				<!-- Chart -->
				<div class="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
					<h2 class="text-xl font-semibold mb-4">Visits Over Time</h2>
					<div class="h-64">
						<canvas id="visits-chart"></canvas>
					</div>
				</div>
				
				<!-- Quick Actions -->
				<div class="bg-white p-6 rounded-lg shadow-md">
					<h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
					<div class="space-y-4">
						<a href="/create" class="block bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition">
							<div class="flex items-center">
								<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
									<i class="fas fa-link text-blue-500"></i>
								</div>
								<div>
									<h3 class="font-medium">Create Short URL</h3>
									<p class="text-sm text-gray-600">Shorten a new link</p>
								</div>
							</div>
						</a>
						
						<a href="/snippet" class="block bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition">
							<div class="flex items-center">
								<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
									<i class="fas fa-code text-purple-500"></i>
								</div>
								<div>
									<h3 class="font-medium">Create Code Snippet</h3>
									<p class="text-sm text-gray-600">Share code with others</p>
								</div>
							</div>
						</a>
						
						<a href="/upload" class="block bg-green-50 hover:bg-green-100 p-4 rounded-lg transition">
							<div class="flex items-center">
								<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
									<i class="fas fa-file-upload text-green-500"></i>
								</div>
								<div>
									<h3 class="font-medium">Upload Files</h3>
									<p class="text-sm text-gray-600">Share files with others</p>
								</div>
							</div>
						</a>
						
						<a href="/analytics" class="block bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg transition">
							<div class="flex items-center">
								<div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
									<i class="fas fa-chart-bar text-yellow-500"></i>
								</div>
								<div>
									<h3 class="font-medium">View Analytics</h3>
									<p class="text-sm text-gray-600">See detailed statistics</p>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
			
			<!-- Recent Activity -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				<!-- Recent Links -->
				<div class="bg-white p-6 rounded-lg shadow-md">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-xl font-semibold">Recent Links</h2>
						<a href="/analytics" class="text-blue-500 hover:text-blue-700 text-sm">View All</a>
					</div>
					
					<div class="space-y-4">
						${renderRecentLinks(recentLinks)}
					</div>
				</div>
				
				<!-- Recent Snippets -->
				<div class="bg-white p-6 rounded-lg shadow-md">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-xl font-semibold">Recent Snippets</h2>
						<a href="/analytics" class="text-blue-500 hover:text-blue-700 text-sm">View All</a>
					</div>
					
					<div class="space-y-4">
						${renderRecentSnippets(recentSnippets)}
					</div>
				</div>
				
				<!-- Recent Files -->
				<div class="bg-white p-6 rounded-lg shadow-md">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-xl font-semibold">Recent Files</h2>
						<a href="/analytics" class="text-blue-500 hover:text-blue-700 text-sm">View All</a>
					</div>
					
					<div class="space-y-4">
						${renderRecentFiles(recentFiles)}
					</div>
				</div>
			</div>
		</div>
	`;
}

/**
 * Render recent links
 */
function renderRecentLinks(links: any[]): string {
	if (links.length === 0) {
		return `<p class="text-gray-500 text-sm italic">No links created yet</p>`;
	}

	return links
		.map(
			(link) => `
		<div class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
			<div class="flex items-center justify-between">
				<div class="truncate">
					<a href="/${link.shortcode}" class="font-medium hover:text-blue-600 truncate block" target="_blank">
						rdrx.co/${link.shortcode}
					</a>
					<p class="text-gray-500 text-xs truncate">${link.url}</p>
				</div>
				<div class="flex items-center text-gray-400 text-sm ml-2">
					<i class="fas fa-eye mr-1"></i> ${link.visits}
				</div>
			</div>
		</div>
	`
		)
		.join('');
}

/**
 * Render recent snippets
 */
function renderRecentSnippets(snippets: any[]): string {
	if (snippets.length === 0) {
		return `<p class="text-gray-500 text-sm italic">No snippets created yet</p>`;
	}

	return snippets
		.map(
			(snippet) => `
		<div class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
			<div class="flex items-center justify-between">
				<div class="truncate">
					<a href="/${snippet.shortcode}" class="font-medium hover:text-blue-600 truncate block" target="_blank">
						rdrx.co/${snippet.shortcode}
					</a>
					<p class="text-gray-500 text-xs truncate">Code snippet</p>
				</div>
				<div class="flex items-center text-gray-400 text-sm ml-2">
					<i class="fas fa-eye mr-1"></i> ${snippet.visits}
				</div>
			</div>
		</div>
	`
		)
		.join('');
}

/**
 * Render recent files
 */
function renderRecentFiles(files: any[]): string {
	if (files.length === 0) {
		return `<p class="text-gray-500 text-sm italic">No files uploaded yet</p>`;
	}

	return files
		.map(
			(file) => `
		<div class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
			<div class="flex items-center justify-between">
				<div class="truncate">
					<a href="/${file.shortcode}" class="font-medium hover:text-blue-600 truncate block" target="_blank">
						rdrx.co/${file.shortcode}
					</a>
					<p class="text-gray-500 text-xs truncate">${file.filename}</p>
				</div>
				<div class="flex items-center text-gray-400 text-sm ml-2">
					<i class="fas fa-eye mr-1"></i> ${file.visits}
				</div>
			</div>
		</div>
	`
		)
		.join('');
}

/**
 * Get user's recent links
 */
async function getUserRecentLinks(env: Env, uid: string): Promise<any[]> {
	try {
		const stmt = env.DB.prepare(`
			SELECT s.shortcode, s.target_url as url, COUNT(a.id) as visits
			FROM short_urls s
			LEFT JOIN analytics a ON s.shortcode = a.shortcode
			WHERE s.creator_id = ?
			AND s.is_snippet = 0
			AND s.is_file = 0
			GROUP BY s.shortcode
			ORDER BY s.created_at DESC
			LIMIT 5
		`);

		const results = await stmt.bind(uid).all();
		return results.results || [];
	} catch (error) {
		console.error('Error getting user recent links:', error);
		return [];
	}
}

/**
 * Get user's recent snippets
 */
async function getUserRecentSnippets(env: Env, uid: string): Promise<any[]> {
	try {
		const stmt = env.DB.prepare(`
			SELECT s.shortcode, COUNT(a.id) as visits
			FROM short_urls s
			LEFT JOIN analytics a ON s.shortcode = a.shortcode
			WHERE s.creator_id = ?
			AND s.is_snippet = 1
			GROUP BY s.shortcode
			ORDER BY s.created_at DESC
			LIMIT 5
		`);

		const results = await stmt.bind(uid).all();
		return results.results || [];
	} catch (error) {
		console.error('Error getting user recent snippets:', error);
		return [];
	}
}

/**
 * Get user's recent files
 */
async function getUserRecentFiles(env: Env, uid: string): Promise<any[]> {
	try {
		// For files, we need to extract the filename from the JSON in target_url
		const stmt = env.DB.prepare(`
			SELECT s.shortcode, s.target_url, COUNT(a.id) as visits
			FROM short_urls s
			LEFT JOIN analytics a ON s.shortcode = a.shortcode
			WHERE s.creator_id = ?
			AND s.is_file = 1
			GROUP BY s.shortcode
			ORDER BY s.created_at DESC
			LIMIT 5
		`);

		const results = await stmt.bind(uid).all();

		// Process the results to extract filenames from the JSON
		return (results.results || []).map((row: any) => {
			let filename = 'File';
			try {
				// The target_url for files is a JSON array of file URLs
				const fileUrls = JSON.parse(row.target_url);
				if (Array.isArray(fileUrls) && fileUrls.length > 0) {
					// Extract filename from the URL
					const url = new URL(fileUrls[0]);
					const pathParts = url.pathname.split('/');
					filename = pathParts[pathParts.length - 1] || 'File';
				}
			} catch (error) {
				console.error('Error parsing file URL:', error);
			}

			return {
				shortcode: row.shortcode,
				filename: filename,
				visits: row.visits,
			};
		});
	} catch (error) {
		console.error('Error getting user recent files:', error);
		return [];
	}
}

/**
 * Get user's analytics summary
 */
async function getUserAnalyticsSummary(env: Env, uid: string): Promise<any> {
	try {
		// Get total links
		const linksStmt = env.DB.prepare(`
			SELECT COUNT(*) as count
			FROM short_urls
			WHERE creator_id = ?
			AND is_snippet = 0
			AND is_file = 0
		`);
		const linksResult = await linksStmt.bind(uid).first();
		const totalLinks = linksResult?.count || 0;

		// Get total visits
		const visitsStmt = env.DB.prepare(`
			SELECT COUNT(*) as count
			FROM analytics a
			JOIN short_urls s ON a.shortcode = s.shortcode
			WHERE s.creator_id = ?
		`);
		const visitsResult = await visitsStmt.bind(uid).first();
		const totalVisits = visitsResult?.count || 0;

		// Get total files
		const filesStmt = env.DB.prepare(`
			SELECT COUNT(*) as count
			FROM short_urls
			WHERE creator_id = ?
			AND is_file = 1
		`);
		const filesResult = await filesStmt.bind(uid).first();
		const totalFiles = filesResult?.count || 0;

		// Get daily visits for the last 7 days
		const dailyVisitsStmt = env.DB.prepare(`
			WITH RECURSIVE dates(date) AS (
				VALUES(date('now', '-6 days'))
				UNION ALL
				SELECT date(date, '+1 day')
				FROM dates
				WHERE date < date('now')
			)
			SELECT dates.date, COUNT(a.id) as count
			FROM dates
			LEFT JOIN analytics a ON date(a.timestamp) = dates.date
			LEFT JOIN short_urls s ON a.shortcode = s.shortcode AND s.creator_id = ?
			GROUP BY dates.date
			ORDER BY dates.date
		`);

		const dailyVisitsResult = await dailyVisitsStmt.bind(uid).all();
		const dailyVisits = (dailyVisitsResult.results || []).map((row: any) => row.count || 0);

		// Calculate growth percentages
		// For simplicity, we'll use a fixed percentage for now
		// In a real implementation, you would compare with previous periods
		const linkGrowth = Math.round(Math.random() * 30);
		const visitGrowth = Math.round(Math.random() * 30);
		const fileGrowth = Math.round(Math.random() * 30);

		return {
			totalLinks,
			totalVisits,
			totalFiles,
			linkGrowth,
			visitGrowth,
			fileGrowth,
			dailyVisits: dailyVisits.length === 7 ? dailyVisits : [0, 0, 0, 0, 0, 0, 0],
		};
	} catch (error) {
		console.error('Error getting user analytics summary:', error);
		return {
			totalLinks: 0,
			totalVisits: 0,
			totalFiles: 0,
			linkGrowth: 0,
			visitGrowth: 0,
			fileGrowth: 0,
			dailyVisits: [0, 0, 0, 0, 0, 0, 0],
		};
	}
}

// Export is already at the top of the file
