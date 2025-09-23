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
	is_bio: number;
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
            .table-container {
                width: 100%;
                border-collapse: collapse;
            }
            .table-header {
                background: #000;
                color: white;
                text-align: left;
                font-weight: bold;
            }
            .table-row {
                border-bottom: 1px solid #e5e7eb;
            }
            .table-cell {
                padding: 12px 16px;
                text-align: left;
                vertical-align: middle;
            }
            .table-cell a {
                color: #FFC107;
                text-decoration: none;
            }
            .table-cell a:hover {
                color: #FF8A00;
            }
            .pagination-active {
                background: #000;
                color: white;
            }
            .edit-btn {
                background: linear-gradient(90deg, #FFC107, #FF8A00);
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .edit-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
            }
            .delete-btn {
                background: #ef4444;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .delete-btn:hover {
                background: #dc2626;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
            }
            /* Modal styles */
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }
            .modal-content {
                background-color: #fefefe;
                margin: 5% auto;
                padding: 20px;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            .close:hover {
                color: black;
            }
            .file-gallery {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
                margin: 1rem 0;
            }
            .file-item {
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 1rem;
                text-align: center;
                position: relative;
            }
            .file-item img {
                max-width: 100%;
                max-height: 100px;
                object-fit: cover;
                border-radius: 4px;
            }
            .file-remove {
                position: absolute;
                top: 5px;
                right: 5px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                cursor: pointer;
            }
            /* Responsive cards for mobile */
            @media (max-width: 768px) {
                .table-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .table-row {
                    display: flex;
                    flex-direction: column;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1rem;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                }
                .table-cell {
                    margin-bottom: 0.5rem;
                }
                .table-cell:last-child {
                    margin-bottom: 0;
                }
            }
        </style>
    `;

	const editModals = `
		<!-- Edit URL Modal -->
		<div id="editUrlModal" class="modal">
			<div class="modal-content">
				<span class="close" onclick="closeModal('editUrlModal')">&times;</span>
				<h2 class="text-xl font-bold mb-4">Edit URL</h2>
				<form id="editUrlForm">
					<input type="hidden" id="editUrlShortcode" />
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700 mb-2">Target URL</label>
						<input type="url" id="editUrlTarget" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" required />
					</div>
					<div class="flex justify-end space-x-2">
						<button type="button" onclick="closeModal('editUrlModal')" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
						<button type="submit" class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">Save Changes</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Edit Snippet Modal -->
		<div id="editSnippetModal" class="modal">
			<div class="modal-content">
				<span class="close" onclick="closeModal('editSnippetModal')">&times;</span>
				<h2 class="text-xl font-bold mb-4">Edit Code Snippet</h2>
				<form id="editSnippetForm">
					<input type="hidden" id="editSnippetShortcode" />
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-700 mb-2">Code Content</label>
						<textarea id="editSnippetContent" rows="10" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono" required></textarea>
					</div>
					<div class="flex justify-end space-x-2">
						<button type="button" onclick="closeModal('editSnippetModal')" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
						<button type="submit" class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">Save Changes</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Edit Files Modal -->
		<div id="editFilesModal" class="modal">
			<div class="modal-content">
				<span class="close" onclick="closeModal('editFilesModal')">&times;</span>
				<h2 class="text-xl font-bold mb-4">Manage Files</h2>
				<input type="hidden" id="editFilesShortcode" />
				<div id="fileGallery" class="file-gallery"></div>
				<div class="mt-4">
					<label class="block text-sm font-medium text-gray-700 mb-2">Add New Files</label>
					<input type="file" id="newFiles" multiple class="w-full px-3 py-2 border border-gray-300 rounded-md" />
					<button type="button" onclick="uploadNewFiles()" class="mt-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">Upload Files</button>
				</div>
				<div class="flex justify-end mt-4">
					<button type="button" onclick="closeModal('editFilesModal')" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Close</button>
				</div>
			</div>
		</div>
	`;

	// Store URL data in a global variable to avoid escaping issues
	const urlDataScript = `
		<script>
			window.urlData = ${JSON.stringify(paginatedUrls.items.reduce((acc, url) => {
				acc[url.shortcode] = {
					shortcode: url.shortcode,
					target_url: url.target_url,
					type: getUrlType(url)
				};
				return acc;
			}, {} as Record<string, any>))};
		</script>
	`;

	const scripts = `
		<script>
			function editItem(shortcode) {
				const urlInfo = window.urlData[shortcode];
				if (!urlInfo) return;
				
				if (urlInfo.type === 'URL Shortener') {
					document.getElementById('editUrlShortcode').value = shortcode;
					document.getElementById('editUrlTarget').value = urlInfo.target_url;
					document.getElementById('editUrlModal').style.display = 'block';
				} else if (urlInfo.type === 'Code Snippet') {
					document.getElementById('editSnippetShortcode').value = shortcode;
					// Fetch current snippet content
					fetch('/api/user/snippet/' + shortcode)
						.then(response => response.json())
						.then(data => {
							if (data.success) {
								document.getElementById('editSnippetContent').value = data.content;
								document.getElementById('editSnippetModal').style.display = 'block';
							}
						});
				} else if (urlInfo.type === 'File Upload') {
					document.getElementById('editFilesShortcode').value = shortcode;
					loadFileGallery(shortcode);
					document.getElementById('editFilesModal').style.display = 'block';
				}
			}

			function deleteItem(shortcode) {
				if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
					fetch('/api/user/delete/' + shortcode, { method: 'DELETE' })
						.then(response => response.json())
						.then(data => {
							if (data.success) {
								location.reload();
							} else {
								alert('Error deleting item: ' + data.message);
							}
						});
				}
			}

			function closeModal(modalId) {
				document.getElementById(modalId).style.display = 'none';
			}

			function loadFileGallery(shortcode) {
				fetch('/api/user/files/' + shortcode)
					.then(response => response.json())
					.then(data => {
						if (data.success) {
							const gallery = document.getElementById('fileGallery');
							gallery.innerHTML = data.files.map(file => 
								'<div class="file-item">' +
								'<button class="file-remove" onclick="removeFile(\\''+shortcode+'\\', \\''+file.name+'\\')">×</button>' +
								(file.isImage ? '<img src="'+file.url+'" alt="'+file.name+'" />' : '<div class="text-gray-500">📄</div>') +
								'<div class="text-xs mt-2 truncate">'+file.name+'</div>' +
								'</div>'
							).join('');
						}
					});
			}

			function removeFile(shortcode, filename) {
				if (confirm('Remove this file?')) {
					fetch('/api/user/files/' + shortcode + '/' + encodeURIComponent(filename), { method: 'DELETE' })
						.then(response => response.json())
						.then(data => {
							if (data.success) {
								loadFileGallery(shortcode);
							} else {
								alert('Error removing file: ' + data.message);
							}
						});
				}
			}

			function uploadNewFiles() {
				const shortcode = document.getElementById('editFilesShortcode').value;
				const files = document.getElementById('newFiles').files;
				if (files.length === 0) return;

				const formData = new FormData();
				for (let file of files) {
					formData.append('files', file);
				}

				fetch('/api/user/files/' + shortcode + '/upload', {
					method: 'POST',
					body: formData
				})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						loadFileGallery(shortcode);
						document.getElementById('newFiles').value = '';
					} else {
						alert('Error uploading files: ' + data.message);
					}
				});
			}

			// Form submissions
			document.getElementById('editUrlForm').addEventListener('submit', function(e) {
				e.preventDefault();
				const shortcode = document.getElementById('editUrlShortcode').value;
				const targetUrl = document.getElementById('editUrlTarget').value;
				
				fetch('/api/user/url/' + shortcode, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: targetUrl })
				})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						location.reload();
					} else {
						alert('Error updating URL: ' + data.message);
					}
				});
			});

			document.getElementById('editSnippetForm').addEventListener('submit', function(e) {
				e.preventDefault();
				const shortcode = document.getElementById('editSnippetShortcode').value;
				const content = document.getElementById('editSnippetContent').value;
				
				fetch('/api/user/snippet/' + shortcode, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ content: content })
				})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						location.reload();
					} else {
						alert('Error updating snippet: ' + data.message);
					}
				});
			});

			// Close modals when clicking outside
			window.onclick = function(event) {
				const modals = ['editUrlModal', 'editSnippetModal', 'editFilesModal'];
				modals.forEach(modalId => {
					const modal = document.getElementById(modalId);
					if (event.target === modal) {
						modal.style.display = 'none';
					}
				});
			}
		</script>
	`;

	return `${styles}
<div class="bg-white shadow-md rounded-2xl p-6 md:p-8 mb-8 max-w-6xl mx-auto form-card">
	<h1 class="text-3xl font-bold mb-6 gradient-text">Your Analytics</h1>
	<p class="text-gray-600 mb-8">View analytics for all your shortened URLs, snippets, and file uploads.</p>

	<!-- Pagination Controls -->
	<div class="flex flex-col md:flex-row justify-between items-center mb-4">
		<div class="mb-4 md:mb-0">
			<label for="perPage" class="text-sm font-medium text-gray-700 mr-2">Items per page:</label>
			<select id="perPage"
				class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
				onchange="window.location.href='?page=1&perPage='+this.value">
				<option value="10" ${sanitizedPerPage === 10 ? 'selected' : ''}>10</option>
				<option value="20" ${sanitizedPerPage === 20 ? 'selected' : ''}>20</option>
				<option value="100" ${sanitizedPerPage === 100 ? 'selected' : ''}>100</option>
			</select>
		</div>
		<div class="text-sm text-gray-700">
			Showing ${paginatedUrls.items.length > 0 ? (sanitizedPage - 1) * sanitizedPerPage + 1 : 0} to
			${Math.min(sanitizedPage * sanitizedPerPage, paginatedUrls.totalItems)} of ${paginatedUrls.totalItems}
			entries
		</div>
	</div>

	<!-- URLs Table -->
	<div class="table-container">
		${
			paginatedUrls.items.length > 0
				? `
		<table class="table-container hidden md:table">
			<thead class="hidden md:block">
				<tr class="table-header">
					<th class="table-cell">Short URL</th>
					<th class="table-cell">Target</th>
					<th class="table-cell">Type</th>
					<th class="table-cell">Created</th>
					<th class="table-cell">Clicks</th>
					<th class="table-cell">Actions</th>
				</tr>
			</thead>
			<tbody>
				${paginatedUrls.items
					.map(
						(url) => `
				<tr class="table-row">
					<td class="table-cell">
						<a href="/${url.shortcode}" target="_blank" class="text-amber-500 hover:text-amber-600 font-medium">
							${url.shortcode}
						</a>
					</td>
					<td class="table-cell">
						<div class="max-w-xs truncate">
							${url.target_url.includes('[') && url.target_url.includes(']') ? 'File Bin ' + url.shortcode : url.target_url}
						</div>
					</td>
					<td class="table-cell">${getUrlType(url)}</td>
					<td class="table-cell">${formatDate(url.created_at)}</td>
					<td class="table-cell">${url.clicks}</td>
					<td class="table-cell">
						<div class="flex space-x-2">
							<a href="/analytics/${url.shortcode}" class="text-amber-500 hover:text-amber-600 font-medium text-sm">
								View
							</a>
							<button onclick="editItem('${url.shortcode}')" class="edit-btn">
								Edit
							</button>
							<button onclick="deleteItem('${url.shortcode}')" class="delete-btn">
								Delete
							</button>
						</div>
					</td>
				</tr>
				`,
					)
					.join('')}
			</tbody>
		</table>
		<div class="table-container md:hidden">
			${paginatedUrls.items
				.map(
					(url) => `
			<div class="table-row">
				<div class="table-cell">
					<strong>Short URL:</strong>
					<a href="/${url.shortcode}" target="_blank" class="text-amber-500 hover:text-amber-600 font-medium">
						${url.shortcode}
					</a>
				</div>
				<div class="table-cell">
					<strong>Target:</strong>
					<div class="max-w-xs truncate">
						${url.target_url.includes('[') && url.target_url.includes(']') ? 'File Bin ' + url.shortcode : url.target_url}
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
					<div class="flex space-x-2">
						<a href="/analytics/${url.shortcode}" class="text-amber-500 hover:text-amber-600 font-medium text-sm">
							View
						</a>
						<button onclick="editItem('${url.shortcode}')" class="edit-btn">
							Edit
						</button>
						<button onclick="deleteItem('${url.shortcode}')" class="delete-btn">
							Delete
						</button>
					</div>
				</div>
			</div>
			`,
				)
				.join('')}
		</div>
		`
				: `
		<div class="table-row">
			<div class="table-cell text-center text-gray-500">
				You haven't created any URLs yet. <a href="/create" class="text-amber-500 hover:text-amber-600">Create
					one now</a>.
			</div>
		</div>
		`
		}
	</div>

	<!-- Pagination -->
	${renderPagination(paginatedUrls.currentPage, paginatedUrls.totalPages, sanitizedPerPage)}
</div>

${editModals}
${urlDataScript}
${scripts}
    `;
}

function getUrlType(url: UrlAnalytics): string {
	if (url.is_snippet === 1) return 'Code Snippet';
	if (url.is_file === 1) return 'File Upload';
	if (url.is_bio === 1) return 'Bio Page';
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
