interface PaginationResult<T> {
	items: T[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
	itemsPerPage: number;
}

interface UrlAnalytics {
	shortcode: string;
	target_url: string;
	created_at: string;
	is_snippet: number;
	is_file: number;
	clicks: number;
}

/**
 * Renders the analytics list UI component
 */
function renderAnalyticsListUI(paginatedUrls: PaginationResult<UrlAnalytics>, sanitizedPage: number, sanitizedPerPage: number): string {
	// Add custom CSS for gradient styling
	const styles = `
		<style>
			.gradient-text {
				background: linear-gradient(90deg, #0ea5e9, #ec4899);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}
			.form-card {
				transition: all 0.3s ease;
				border-top: 4px solid transparent;
				border-image: linear-gradient(to right, #0ea5e9, #ec4899);
				border-image-slice: 1;
			}
			.table-header {
				background: linear-gradient(90deg, #0ea5e9, #ec4899);
				color: white;
			}
			.pagination-active {
				background: linear-gradient(90deg, #0ea5e9, #ec4899);
				color: white;
			}
		</style>
	`;

	return `
		${styles}
		<div class="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8 max-w-6xl mx-auto form-card">
			<h1 class="text-3xl font-bold mb-6 gradient-text">Your Analytics</h1>
			<p class="text-gray-600 mb-8">View analytics for all your shortened URLs, snippets, and file uploads.</p>
			
			<!-- Pagination Controls -->
			<div class="flex flex-col md:flex-row justify-between items-center mb-4">
				<div class="mb-4 md:mb-0">
					<label for="perPage" class="text-sm font-medium text-gray-700 mr-2">Items per page:</label>
					<select id="perPage" class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
							onchange="window.location.href='?page=1&perPage='+this.value">
						<option value="10" ${sanitizedPerPage === 10 ? 'selected' : ''}>10</option>
						<option value="20" ${sanitizedPerPage === 20 ? 'selected' : ''}>20</option>
						<option value="100" ${sanitizedPerPage === 100 ? 'selected' : ''}>100</option>
					</select>
				</div>
				<div class="text-sm text-gray-700">
					Showing ${paginatedUrls.items.length > 0 ? (sanitizedPage - 1) * sanitizedPerPage + 1 : 0} to 
					${Math.min(sanitizedPage * sanitizedPerPage, paginatedUrls.totalItems)} of ${paginatedUrls.totalItems} entries
				</div>
			</div>
			
			<!-- URLs Table -->
			<div class="overflow-x-auto">
				<table class="min-w-full bg-white border border-gray-200 rounded-lg">
					<thead>
						<tr class="table-header">
							<th class="py-3 px-4 text-left text-sm font-medium border-b">Short URL</th>
							<th class="py-3 px-4 text-left text-sm font-medium border-b">Target</th>
							<th class="py-3 px-4 text-left text-sm font-medium border-b">Type</th>
							<th class="py-3 px-4 text-left text-sm font-medium border-b">Created</th>
							<th class="py-3 px-4 text-left text-sm font-medium border-b">Clicks</th>
							<th class="py-3 px-4 text-left text-sm font-medium border-b">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						${
							paginatedUrls.items.length > 0
								? paginatedUrls.items
										.map(
											(url) => `
												<tr class="hover:bg-gray-50 transition duration-150">
													<td class="py-3 px-4 text-sm text-gray-700">
														<a href="/${url.shortcode}" target="_blank" class="text-primary-600 hover:text-primary-800 font-medium">
															${url.shortcode}
														</a>
													</td>
													<td class="py-3 px-4 text-sm text-gray-700">
														<div class="max-w-xs truncate">
															${url.target_url}
														</div>
													</td>
													<td class="py-3 px-4 text-sm text-gray-700">
														${getUrlType(url)}
													</td>
													<td class="py-3 px-4 text-sm text-gray-700">
														${formatDate(url.created_at)}
													</td>
													<td class="py-3 px-4 text-sm font-medium text-gray-700">
														${url.clicks}
													</td>
													<td class="py-3 px-4 text-sm text-gray-700">
														<a href="/analytics/${url.shortcode}" class="text-primary-600 hover:text-primary-800 font-medium">
															View Details
														</a>
													</td>
												</tr>
											`,
										)
										.join('')
								: `
									<tr>
										<td colspan="6" class="py-4 px-4 text-center text-gray-500">
											You haven't created any URLs yet. <a href="/create" class="text-primary-600 hover:text-primary-800">Create one now</a>.
										</td>
									</tr>
								`
						}
					</tbody>
				</table>
			</div>
			
			<!-- Pagination -->
			${renderPagination(paginatedUrls.currentPage, paginatedUrls.totalPages, sanitizedPerPage)}
		</div>
	`;
}

function getUrlType(url: UrlAnalytics): string {
	if (url.is_snippet === 1) return 'Code Snippet';
	if (url.is_file === 1) return 'File Upload';
	return 'URL Shortener';
}

function formatDate(dateString: string): string {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	} catch (e) {
		return dateString;
	}
}

function renderPagination(currentPage: number, totalPages: number, itemsPerPage: number): string {
	if (totalPages <= 1) {
		return '';
	}

	let paginationHtml = `
		<div class="flex justify-center mt-6">
			<nav class="inline-flex rounded-md shadow">
	`;

	// Previous button
	paginationHtml += `
		<a href="?page=${Math.max(1, currentPage - 1)}&perPage=${itemsPerPage}" 
		   class="${
					currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
				} relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
			Previous
		</a>
	`;

	// Page numbers
	const maxPagesToShow = 5;
	let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
	let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

	if (endPage - startPage + 1 < maxPagesToShow) {
		startPage = Math.max(1, endPage - maxPagesToShow + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		paginationHtml += `
			<a href="?page=${i}&perPage=${itemsPerPage}" 
			   class="relative inline-flex items-center px-4 py-2 text-sm font-medium ${
						i === currentPage ? 'pagination-active' : 'text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50'
					}">
				${i}
			</a>
		`;
	}

	// Next button
	paginationHtml += `
		<a href="?page=${Math.min(totalPages, currentPage + 1)}&perPage=${itemsPerPage}" 
		   class="${
					currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
				} relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
			Next
		</a>
	`;

	paginationHtml += `
			</nav>
		</div>
	`;

	return paginationHtml;
}

export { renderAnalyticsListUI, type PaginationResult, type UrlAnalytics };
