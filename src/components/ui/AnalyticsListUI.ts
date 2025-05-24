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
	// Add custom CSS for gradient styling and responsive cards
	const styles = `
        <style>
            .gradient-text {
                background: linear-gradient(90deg, #FFC107, #FF8A00);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .form-card {
                transition: all 0.3s ease;
                border-radius: 24px;
                border: 2px solid #FFF;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            }
            .table-header {
                background: #000;
                color: white;
            }
            .pagination-active {
                background: #000;
                color: white;
            }
            /* Responsive cards for mobile */
            @media (max-width: 768px) {
                .table-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .table-container .table-row {
                    display: flex;
                    flex-direction: column;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1rem;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                }
                .table-container .table-row .table-cell {
                    margin-bottom: 0.5rem;
                }
                .table-container .table-row .table-cell:last-child {
                    margin-bottom: 0;
                }
            }
        </style>
    `;

	return `
        ${styles}
        <div class="bg-white shadow-md rounded-2xl p-6 md:p-8 mb-8 max-w-6xl mx-auto form-card">
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
            <div class="table-container">
                ${
									paginatedUrls.items.length > 0
										? paginatedUrls.items
												.map(
													(url) => `
                                        <div class="table-row">
                                            <div class="table-cell">
                                                <strong>Short URL:</strong> 
                                                <a href="/${
																									url.shortcode
																								}" target="_blank" class="text-amber-500 hover:text-amber-600 font-medium">
                                                    ${url.shortcode}
                                                </a>
                                            </div>
                                            <div class="table-cell">
                                                <strong>Target:</strong> 
                                                <div class="max-w-xs truncate">
                                                    ${url.target_url}
                                                </div>
                                            </div>
                                            <div class="table-cell">
                                                <strong>Type:</strong> ${getUrlType(url)}
                                            </div>
                                            <div class="table-cell">
                                                <strong>Created:</strong> ${formatDate(url.created_at)}
                                            </div>
                                            <div class="table-cell">
                                                <strong>Clicks:</strong> ${url.clicks}
                                            </div>
                                            <div class="table-cell">
                                                <a href="/analytics/${
																									url.shortcode
																								}" class="text-amber-500 hover:text-amber-600 font-medium">
                                                    View Details
                                                </a>
                                            </div>
                                        </div>
                                    `
												)
												.join('')
										: `
                            <div class="table-row">
                                <div class="table-cell text-center text-gray-500">
                                    You haven't created any URLs yet. <a href="/create" class="text-amber-500 hover:text-amber-600">Create one now</a>.
                                </div>
                            </div>
                        `
								}
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
				} relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-full hover:bg-gray-50">
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
						i === currentPage ? 'pagination-active' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
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
				} relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-full hover:bg-gray-50">
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
