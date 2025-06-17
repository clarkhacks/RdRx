function renderSidebar(currentPage: string = ''): string {
	return `
  <div x-data="{ sidebarOpen: false }" class="relative">
    <!-- Mobile sidebar toggle -->
    <button @click="sidebarOpen = !sidebarOpen" class="md:hidden fixed bottom-4 left-4 bg-white dark:bg-dark-700 text-gray-800 dark:text-dark-200 p-3 rounded-github shadow-github-md border border-gray-200 dark:border-dark-600 z-50 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    
    <!-- Sidebar backdrop for mobile -->
    <div x-show="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>
    
    <!-- Sidebar -->
    <aside 
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'" 
      class="fixed top-0 left-0 z-40 h-screen w-64 bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-600 transition-all duration-300 ease-in-out md:sticky md:top-[73px] md:h-[calc(100vh-73px)]"
    >
      <div class="flex h-full flex-col overflow-y-auto py-4 px-3">
        <div class="mb-6 px-4 md:hidden">
          <a href="/" class="flex items-center gap-2">
            <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-8 h-8">
            <span class="text-xl font-semibold text-gray-900 dark:text-dark-100">RdRx</span>
          </a>
        </div>
        
        <nav class="space-y-1">
          <a 
            href="/dashboard" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-github transition-colors duration-200 ${
							currentPage === 'dashboard' 
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
								: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-dark-100'
						}"
          >
            <svg class="w-5 h-5 mr-3 ${currentPage === 'dashboard' ? 'text-blue-500' : 'text-gray-400 dark:text-dark-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            </svg>
            Dashboard
          </a>
          
          <a 
            href="/create" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-github transition-colors duration-200 ${
							currentPage === 'create' 
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
								: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-dark-100'
						}"
          >
            <svg class="w-5 h-5 mr-3 ${currentPage === 'create' ? 'text-blue-500' : 'text-gray-400 dark:text-dark-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            Create URL
          </a>
          
          <a 
            href="/upload" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-github transition-colors duration-200 ${
							currentPage === 'upload' 
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
								: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-dark-100'
						}"
          >
            <svg class="w-5 h-5 mr-3 ${currentPage === 'upload' ? 'text-blue-500' : 'text-gray-400 dark:text-dark-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Upload Files
          </a>
          
          <a 
            href="/snippet" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-github transition-colors duration-200 ${
							currentPage === 'snippet' 
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
								: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-dark-100'
						}"
          >
            <svg class="w-5 h-5 mr-3 ${currentPage === 'snippet' ? 'text-blue-500' : 'text-gray-400 dark:text-dark-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
            Create Snippet
          </a>
          
          <a 
            href="/bio" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-github transition-colors duration-200 ${
							currentPage === 'bio' 
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
								: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-dark-100'
						}"
          >
            <svg class="w-5 h-5 mr-3 ${currentPage === 'bio' ? 'text-blue-500' : 'text-gray-400 dark:text-dark-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            My Bio Page
          </a>
          
          <a 
            id="analytics-link"
            href="/analytics" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-github transition-colors duration-200 ${
							currentPage === 'analytics' 
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
								: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-dark-100'
						}"
          >
            <svg class="w-5 h-5 mr-3 ${currentPage === 'analytics' ? 'text-blue-500' : 'text-gray-400 dark:text-dark-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Analytics
          </a>
          
          <a 
            href="/account" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-github transition-colors duration-200 ${
							currentPage === 'account' 
								? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
								: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-dark-100'
						}"
          >
            <svg class="w-5 h-5 mr-3 ${currentPage === 'account' ? 'text-blue-500' : 'text-gray-400 dark:text-dark-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            My Account
          </a>
          
          <a 
            id="admin-nav-item" 
            href="/admin" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-github transition-colors duration-200 ${
							currentPage === 'admin' 
								? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-l-4 border-red-500' 
								: 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-dark-100'
						}"
            style="display: none;"
          >
            <svg class="w-5 h-5 mr-3 ${currentPage === 'admin' ? 'text-red-500' : 'text-gray-400 dark:text-dark-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Admin Panel
          </a>
        </nav>
        
        <div class="mt-auto px-4 md:hidden">
          <div id="sidebar-user-button" class="mt-6"></div>
        </div>
      </div>
    </aside>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      // Get the current user info from our custom auth API
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            // Get the analytics link
            const analyticsLink = document.getElementById('analytics-link');
            if (analyticsLink) {
              // Update the href to include the user ID
              const userId = data.user.uid;
              if (userId) {
                const currentHref = analyticsLink.getAttribute('href');
                analyticsLink.setAttribute('href', currentHref + '?userId=' + userId);
              }
            }
            
            // Check if user is admin and show admin nav item
            const adminNavItem = document.getElementById('admin-nav-item');
            if (adminNavItem) {
              // Check if user is admin via API call
              try {
                const adminCheckResponse = await fetch('/api/admin/check');
                if (adminCheckResponse.ok) {
                  const adminData = await adminCheckResponse.json();
                  if (adminData.isAdmin) {
                    adminNavItem.style.display = 'flex';
                  }
                }
              } catch (error) {
                console.error('Error checking admin status:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    });
  </script>
  `;
}

export { renderSidebar };
