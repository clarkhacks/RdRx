function renderAdminUI(): string {
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
    <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 md:p-8 border border-gray-200 dark:border-dark-600">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-dark-100">Users Management</h2>
        <button id="add-user-btn" class="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-github transition-all duration-200">
          Add New User
        </button>
      </div>
      
      <!-- Search and Filters -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" id="user-search" placeholder="Search users..." 
               class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
        <select id="user-filter" class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
          <option value="">All Users</option>
          <option value="verified">Verified Only</option>
          <option value="unverified">Unverified Only</option>
        </select>
        <button id="refresh-users" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-github transition-all duration-200">
          Refresh
        </button>
      </div>
      
      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
          <thead class="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="users-table-body" class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-600">
            <!-- Users will be loaded here -->
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-dark-400">
          Showing <span id="users-showing">0</span> of <span id="users-total">0</span> users
        </div>
        <div class="flex space-x-2">
          <button id="users-prev" class="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-github text-sm font-medium text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 transition-colors duration-200">
            Previous
          </button>
          <span id="users-page-info" class="px-4 py-2 text-sm text-gray-700 dark:text-dark-300">Page 1</span>
          <button id="users-next" class="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-github text-sm font-medium text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 transition-colors duration-200">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- URLs Management Tab -->
  <div id="urls-tab" class="tab-content hidden">
    <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 md:p-8 border border-gray-200 dark:border-dark-600">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-dark-100">URLs Management</h2>
      
      <!-- Search and Filters -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" id="url-search" placeholder="Search URLs..." 
               class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
        <select id="url-filter" class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
          <option value="">All URLs</option>
          <option value="url">URLs Only</option>
          <option value="snippet">Snippets Only</option>
          <option value="file">Files Only</option>
        </select>
        <button id="refresh-urls" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-github transition-all duration-200">
          Refresh
        </button>
      </div>
      
      <!-- URLs Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
          <thead class="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Shortcode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Target</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Owner</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="urls-table-body" class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-600">
            <!-- URLs will be loaded here -->
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-dark-400">
          Showing <span id="urls-showing">0</span> of <span id="urls-total">0</span> URLs
        </div>
        <div class="flex space-x-2">
          <button id="urls-prev" class="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-github text-sm font-medium text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 transition-colors duration-200">
            Previous
          </button>
          <span id="urls-page-info" class="px-4 py-2 text-sm text-gray-700 dark:text-dark-300">Page 1</span>
          <button id="urls-next" class="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-github text-sm font-medium text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 transition-colors duration-200">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- System Analytics Tab -->
  <div id="analytics-tab" class="tab-content hidden">
    <div class="bg-white dark:bg-dark-800 shadow-github-md dark:shadow-github-dark rounded-github-lg p-6 md:p-8 border border-gray-200 dark:border-dark-600">
      <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-dark-100">System Analytics</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-github-lg p-6 text-white">
          <h3 class="text-lg font-semibold mb-2">Total Users</h3>
          <p class="text-3xl font-bold" id="analytics-users">0</p>
        </div>
        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-github-lg p-6 text-white">
          <h3 class="text-lg font-semibold mb-2">Total URLs</h3>
          <p class="text-3xl font-bold" id="analytics-urls">0</p>
        </div>
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-github-lg p-6 text-white">
          <h3 class="text-lg font-semibold mb-2">Total Views</h3>
          <p class="text-3xl font-bold" id="analytics-views">0</p>
        </div>
        <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-github-lg p-6 text-white">
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
    <div class="bg-white dark:bg-dark-800 rounded-github-lg p-6 w-full max-w-md border border-gray-200 dark:border-dark-600">
      <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-dark-100">Add New User</h3>
      <form id="add-user-form" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-1">Name</label>
          <input type="text" name="name" required class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-1">Email</label>
          <input type="email" name="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-1">Password</label>
          <input type="password" name="password" required class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
        </div>
        <div class="flex items-center">
          <input type="checkbox" name="email_verified" class="h-4 w-4 text-blue-500 rounded">
          <label class="ml-2 text-sm text-gray-700 dark:text-dark-300">Email Verified</label>
        </div>
        <div class="flex space-x-4 pt-4">
          <button type="submit" class="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-github transition-all duration-200 flex-1">
            Add User
          </button>
          <button type="button" id="cancel-add-user" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-github transition-all duration-200">
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
    <div class="bg-white dark:bg-dark-800 rounded-github-lg p-6 w-full max-w-md border border-gray-200 dark:border-dark-600">
      <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-dark-100">Edit URL</h3>
      <form id="edit-url-form" class="space-y-4">
        <input type="hidden" name="shortcode" id="edit-shortcode">
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-dark-100 mb-1">Target URL</label>
          <input type="url" name="url" id="edit-url" required class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200">
        </div>
        <div class="flex space-x-4 pt-4">
          <button type="submit" class="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-github transition-all duration-200 flex-1">
            Update URL
          </button>
          <button type="button" id="cancel-edit-url" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-github transition-all duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  `;
}

export { renderAdminUI };
