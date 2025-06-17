import { Env } from '../../types';
import { renderDocumentHead } from '../layouts/DocumentHead';
import { renderPageLayout } from '../layouts/PageLayout';

/**
 * Render the admin panel page
 */
export async function renderAdminPage(request: Request, env: Env): Promise<Response> {
	// Check if user is authenticated
	if (!request.user) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/login?redirect_url=' + encodeURIComponent('/admin'),
			},
		});
	}

	// Check if user is admin
	if (request.user.uid !== env.ADMIN_UID) {
		return new Response('Forbidden', { status: 403 });
	}

	const user = request.user;
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'Admin Panel - RDRX' })}
		<body class="bg-gray-50">
			${renderPageLayout({
				title: 'Admin Panel - RDRX',
				content: renderAdminContent(),
				activeNavItem: 'admin',
			})}
			${renderAdminScripts()}
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Render the admin panel content
 */
function renderAdminContent(): string {
	return `
        <div class="max-w-7xl mx-auto py-8 px-4">
            <!-- Header Section -->
            <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 md:p-8 mb-8 border border-gray-200 dark:border-dark-600">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-4xl font-bold mb-2 text-gray-900 dark:text-dark-100">Admin Panel</h1>
                        <p class="text-gray-600 dark:text-dark-300">Manage users, URLs, and system settings</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500 dark:text-dark-400">Total Users: <span id="total-users">Loading...</span></p>
                        <p class="text-sm text-gray-500 dark:text-dark-400">Total URLs: <span id="total-urls">Loading...</span></p>
                    </div>
                </div>
            </div>
            
            <!-- Navigation Tabs -->
            <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 mb-8 border border-gray-200 dark:border-dark-600">
                <div class="flex space-x-4">
                    <button class="admin-tab active px-6 py-3 rounded-github font-semibold transition-all duration-200 bg-blue-500 text-white" data-tab="users">
                        Users Management
                    </button>
                    <button class="admin-tab px-6 py-3 rounded-github font-semibold transition-all duration-200 text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700" data-tab="urls">
                        URLs Management
                    </button>
                    <button class="admin-tab px-6 py-3 rounded-github font-semibold transition-all duration-200 text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700" data-tab="analytics">
                        System Analytics
                    </button>
                </div>
            </div>
            
            <!-- Users Management Tab -->
            <div id="users-tab" class="tab-content">
                <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 form-card">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Users Management</h2>
                        <button id="add-user-btn" class="btn-success text-white font-medium py-3 px-6 rounded-full transition duration-300">
                            Add New User
                        </button>
                    </div>
                    
                    <!-- Search and Filters -->
                    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" id="user-search" placeholder="Search users..." 
                               class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                        <select id="user-filter" class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                            <option value="">All Users</option>
                            <option value="verified">Verified Only</option>
                            <option value="unverified">Unverified Only</option>
                        </select>
                        <button id="refresh-users" class="btn-gradient text-white font-medium py-3 px-6 rounded-full transition duration-300">
                            Refresh
                        </button>
                    </div>
                    
                    <!-- Users Table -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="users-table-body" class="bg-white divide-y divide-gray-200">
                                <!-- Users will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="mt-6 flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                            Showing <span id="users-showing">0</span> of <span id="users-total">0</span> users
                        </div>
                        <div class="flex space-x-2">
                            <button id="users-prev" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <span id="users-page-info" class="px-4 py-2 text-sm text-gray-700">Page 1</span>
                            <button id="users-next" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- URLs Management Tab -->
            <div id="urls-tab" class="tab-content hidden">
                <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 form-card">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800">URLs Management</h2>
                    
                    <!-- Search and Filters -->
                    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" id="url-search" placeholder="Search URLs..." 
                               class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                        <select id="url-filter" class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                            <option value="">All URLs</option>
                            <option value="url">URLs Only</option>
                            <option value="snippet">Snippets Only</option>
                            <option value="file">Files Only</option>
                        </select>
                        <button id="refresh-urls" class="btn-gradient text-white font-medium py-3 px-6 rounded-full transition duration-300">
                            Refresh
                        </button>
                    </div>
                    
                    <!-- URLs Table -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shortcode</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="urls-table-body" class="bg-white divide-y divide-gray-200">
                                <!-- URLs will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="mt-6 flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                            Showing <span id="urls-showing">0</span> of <span id="urls-total">0</span> URLs
                        </div>
                        <div class="flex space-x-2">
                            <button id="urls-prev" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <span id="urls-page-info" class="px-4 py-2 text-sm text-gray-700">Page 1</span>
                            <button id="urls-next" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- System Analytics Tab -->
            <div id="analytics-tab" class="tab-content hidden">
                <div class="bg-white shadow-xl rounded-xl p-6 md:p-8 form-card">
                    <h2 class="text-2xl font-bold mb-6 text-gray-800">System Analytics</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                            <h3 class="text-lg font-semibold mb-2">Total Users</h3>
                            <p class="text-3xl font-bold" id="analytics-users">0</p>
                        </div>
                        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                            <h3 class="text-lg font-semibold mb-2">Total URLs</h3>
                            <p class="text-3xl font-bold" id="analytics-urls">0</p>
                        </div>
                        <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                            <h3 class="text-lg font-semibold mb-2">Total Views</h3>
                            <p class="text-3xl font-bold" id="analytics-views">0</p>
                        </div>
                        <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                            <h3 class="text-lg font-semibold mb-2">Storage Used</h3>
                            <p class="text-3xl font-bold" id="analytics-storage">0 MB</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add User Modal -->
        <div id="add-user-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-xl p-6 w-full max-w-md">
                    <h3 class="text-xl font-bold mb-4">Add New User</h3>
                    <form id="add-user-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" name="name" required class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" required class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" name="password" required class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" name="email_verified" class="h-4 w-4 text-primary-500 rounded">
                            <label class="ml-2 text-sm text-gray-700">Email Verified</label>
                        </div>
                        <div class="flex space-x-4 pt-4">
                            <button type="submit" class="btn-gradient text-white font-medium py-3 px-6 rounded-full transition duration-300 flex-1">
                                Add User
                            </button>
                            <button type="button" id="cancel-add-user" class="btn-danger text-white font-medium py-3 px-6 rounded-full transition duration-300">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <!-- Edit URL Modal -->
        <div id="edit-url-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-xl p-6 w-full max-w-md">
                    <h3 class="text-xl font-bold mb-4">Edit URL</h3>
                    <form id="edit-url-form" class="space-y-4">
                        <input type="hidden" name="shortcode" id="edit-shortcode">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
                            <input type="url" name="url" id="edit-url" required class="block w-full px-4 py-3 border border-gray-300 rounded-2xl input-focus text-gray-900 transition">
                        </div>
                        <div class="flex space-x-4 pt-4">
                            <button type="submit" class="btn-gradient text-white font-medium py-3 px-6 rounded-full transition duration-300 flex-1">
                                Update URL
                            </button>
                            <button type="button" id="cancel-edit-url" class="btn-danger text-white font-medium py-3 px-6 rounded-full transition duration-300">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render admin panel scripts
 */
function renderAdminScripts(): string {
	return `
        <script>
            let currentUsersPage = 1;
            let currentUrlsPage = 1;
            const itemsPerPage = 20;
            
            // Tab switching
            document.querySelectorAll('.admin-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabName = this.dataset.tab;
                    
                    // Update active tab
                    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show/hide content
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.add('hidden');
                    });
                    document.getElementById(tabName + '-tab').classList.remove('hidden');
                    
                    // Load data for the active tab
                    if (tabName === 'users') {
                        loadUsers();
                    } else if (tabName === 'urls') {
                        loadUrls();
                    } else if (tabName === 'analytics') {
                        loadAnalytics();
                    }
                });
            });
            
            // Load initial data
            loadUsers();
            loadSystemStats();
            
            // Users management
            async function loadUsers(page = 1, search = '', filter = '') {
                try {
                    const params = new URLSearchParams({
                        page: page.toString(),
                        limit: itemsPerPage.toString(),
                        search,
                        filter
                    });
                    
                    const response = await fetch('/api/admin/users?' + params);
                    const data = await response.json();
                    
                    if (data.success) {
                        renderUsersTable(data.users);
                        updateUsersPagination(data.pagination);
                        currentUsersPage = page;
                    }
                } catch (error) {
                    console.error('Error loading users:', error);
                }
            }
            
            function renderUsersTable(users) {
                const tbody = document.getElementById('users-table-body');
                tbody.innerHTML = users.map(user => \`
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <img class="h-10 w-10 rounded-full" src="\${user.profile_picture_url || 'https://via.placeholder.com/40'}" alt="">
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">\${user.name}</div>
                                    <div class="text-sm text-gray-500">ID: \${user.uid}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">\${user.email}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${user.email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                \${user.email_verified ? 'Verified' : 'Unverified'}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button onclick="toggleUserVerification('\${user.uid}', \${!user.email_verified})" 
                                    class="text-blue-600 hover:text-blue-900">
                                \${user.email_verified ? 'Unverify' : 'Verify'}
                            </button>
                            <button onclick="deleteUser('\${user.uid}')" 
                                    class="text-red-600 hover:text-red-900">
                                Delete
                            </button>
                        </td>
                    </tr>
                \`).join('');
            }
            
            function updateUsersPagination(pagination) {
                document.getElementById('users-showing').textContent = pagination.showing;
                document.getElementById('users-total').textContent = pagination.total;
                document.getElementById('users-page-info').textContent = \`Page \${pagination.page} of \${pagination.totalPages}\`;
                
                document.getElementById('users-prev').disabled = pagination.page <= 1;
                document.getElementById('users-next').disabled = pagination.page >= pagination.totalPages;
            }
            
            // URLs management
            async function loadUrls(page = 1, search = '', filter = '') {
                try {
                    const params = new URLSearchParams({
                        page: page.toString(),
                        limit: itemsPerPage.toString(),
                        search,
                        filter
                    });
                    
                    const response = await fetch('/api/admin/urls?' + params);
                    const data = await response.json();
                    
                    if (data.success) {
                        renderUrlsTable(data.urls);
                        updateUrlsPagination(data.pagination);
                        currentUrlsPage = page;
                    }
                } catch (error) {
                    console.error('Error loading URLs:', error);
                }
            }
            
            function renderUrlsTable(urls) {
                const tbody = document.getElementById('urls-table-body');
                tbody.innerHTML = urls.map(url => \`
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <a href="https://rdrx.co/\${url.shortcode}" target="_blank" class="text-blue-600 hover:text-blue-900">
                                \${url.shortcode}
                            </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                \${url.type || 'URL'}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            \${url.url || url.snippet || url.files || 'N/A'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${url.user_name || 'Anonymous'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            \${new Date(url.created_at).toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            \${url.url ? \`<button onclick="editUrl('\${url.shortcode}', '\${url.url}')" class="text-blue-600 hover:text-blue-900">Edit</button>\` : ''}
                            <button onclick="deleteUrl('\${url.shortcode}')" class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                    </tr>
                \`).join('');
            }
            
            function updateUrlsPagination(pagination) {
                document.getElementById('urls-showing').textContent = pagination.showing;
                document.getElementById('urls-total').textContent = pagination.total;
                document.getElementById('urls-page-info').textContent = \`Page \${pagination.page} of \${pagination.totalPages}\`;
                
                document.getElementById('urls-prev').disabled = pagination.page <= 1;
                document.getElementById('urls-next').disabled = pagination.page >= pagination.totalPages;
            }
            
            // System stats
            async function loadSystemStats() {
                try {
                    const response = await fetch('/api/admin/stats');
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('total-users').textContent = data.stats.totalUsers;
                        document.getElementById('total-urls').textContent = data.stats.totalUrls;
                    }
                } catch (error) {
                    console.error('Error loading system stats:', error);
                }
            }
            
            // Analytics
            async function loadAnalytics() {
                try {
                    const response = await fetch('/api/admin/analytics');
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('analytics-users').textContent = data.analytics.totalUsers;
                        document.getElementById('analytics-urls').textContent = data.analytics.totalUrls;
                        document.getElementById('analytics-views').textContent = data.analytics.totalViews;
                        document.getElementById('analytics-storage').textContent = data.analytics.storageUsed + ' MB';
                    }
                } catch (error) {
                    console.error('Error loading analytics:', error);
                }
            }
            
            // User actions
            async function toggleUserVerification(userId, verified) {
                try {
                    const response = await fetch('/api/admin/users/' + userId + '/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ verified })
                    });
                    
                    if (response.ok) {
                        loadUsers(currentUsersPage);
                    }
                } catch (error) {
                    console.error('Error toggling user verification:', error);
                }
            }
            
            async function deleteUser(userId) {
                if (!confirm('Are you sure you want to delete this user? This will remove all their data including URLs, files, and profile pictures.')) {
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/users/' + userId, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        loadUsers(currentUsersPage);
                        loadSystemStats();
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            }
            
            // URL actions
            function editUrl(shortcode, url) {
                document.getElementById('edit-shortcode').value = shortcode;
                document.getElementById('edit-url').value = url;
                document.getElementById('edit-url-modal').classList.remove('hidden');
            }
            
            async function deleteUrl(shortcode) {
                if (!confirm('Are you sure you want to delete this URL?')) {
                    return;
                }
                
                try {
                    const response = await fetch('/api/admin/urls/' + shortcode, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        loadUrls(currentUrlsPage);
                        loadSystemStats();
                    }
                } catch (error) {
                    console.error('Error deleting URL:', error);
                }
            }
            
            // Event listeners
            document.getElementById('add-user-btn').addEventListener('click', () => {
                document.getElementById('add-user-modal').classList.remove('hidden');
            });
            
            document.getElementById('cancel-add-user').addEventListener('click', () => {
                document.getElementById('add-user-modal').classList.add('hidden');
            });
            
            document.getElementById('cancel-edit-url').addEventListener('click', () => {
                document.getElementById('edit-url-modal').classList.add('hidden');
            });
            
            // Add user form
            document.getElementById('add-user-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    email_verified: formData.get('email_verified') === 'on'
                };
                
                try {
                    const response = await fetch('/api/admin/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });
                    
                    if (response.ok) {
                        document.getElementById('add-user-modal').classList.add('hidden');
                        e.target.reset();
                        loadUsers(currentUsersPage);
                        loadSystemStats();
                    }
                } catch (error) {
                    console.error('Error adding user:', error);
                }
            });
            
            // Edit URL form
            document.getElementById('edit-url-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const shortcode = formData.get('shortcode');
                const url = formData.get('url');
                
                try {
                    const response = await fetch('/api/admin/urls/' + shortcode, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url })
                    });
                    
                    if (response.ok) {
                        document.getElementById('edit-url-modal').classList.add('hidden');
                        loadUrls(currentUrlsPage);
                    }
                } catch (error) {
                    console.error('Error updating URL:', error);
                }
            });
            
            // Search and filter event listeners
            document.getElementById('user-search').addEventListener('input', (e) => {
                loadUsers(1, e.target.value, document.getElementById('user-filter').value);
            });
            
            document.getElementById('user-filter').addEventListener('change', (e) => {
                loadUsers(1, document.getElementById('user-search').value, e.target.value);
            });
            
            document.getElementById('url-search').addEventListener('input', (e) => {
                loadUrls(1, e.target.value, document.getElementById('url-filter').value);
            });
            
            document.getElementById('url-filter').addEventListener('change', (e) => {
                loadUrls(1, document.getElementById('url-search').value, e.target.value);
            });
            
            // Refresh buttons
            document.getElementById('refresh-users').addEventListener('click', () => {
                loadUsers(currentUsersPage);
            });
            
            document.getElementById('refresh-urls').addEventListener('click', () => {
                loadUrls(currentUrlsPage);
            });
            
            // Pagination buttons
            document.getElementById('users-prev').addEventListener('click', () => {
                if (currentUsersPage > 1) {
                    loadUsers(currentUsersPage - 1);
                }
            });
            
            document.getElementById('users-next').addEventListener('click', () => {
                loadUsers(currentUsersPage + 1);
            });
            
            document.getElementById('urls-prev').addEventListener('click', () => {
                if (currentUrlsPage > 1) {
                    loadUrls(currentUrlsPage - 1);
                }
            });
            
            document.getElementById('urls-next').addEventListener('click', () => {
                loadUrls(currentUrlsPage + 1);
            });
        </script>
    `;
}
