function renderSidebar(currentPage: string = ''): string {
	return `
  <div x-data="{ sidebarOpen: false }" class="relative">
    <!-- Mobile sidebar toggle -->
    <button @click="sidebarOpen = !sidebarOpen" class="md:hidden fixed bottom-4 right-4 bg-primary-500 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    
    <!-- Sidebar backdrop for mobile -->
    <div x-show="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>
    
    <!-- Sidebar -->
    <aside 
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'" 
      class="fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:sticky md:top-[73px] md:h-[calc(100vh-73px)] md:pt-0"
    >
      <div class="flex h-full flex-col overflow-y-auto py-4 px-3">
        <div class="mb-6 px-4 md:hidden">
          <a href="/" class="flex items-center gap-2">
            <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-8 h-8">
            <span class="text-2xl font-bold text-gray-800">RdRx</span>
          </a>
        </div>
        
        <ul class="space-y-2">
          <li>
            <a 
              href="/create" 
              class="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 ${
								currentPage === 'create' ? 'bg-primary-50 text-primary-700 font-medium' : ''
							}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 ${
								currentPage === 'create' ? 'text-primary-500' : 'text-gray-500'
							}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Create URL</span>
            </a>
          </li>
          <li>
            <a 
              href="/upload" 
              class="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 ${
								currentPage === 'upload' ? 'bg-primary-50 text-primary-700 font-medium' : ''
							}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 ${
								currentPage === 'upload' ? 'text-primary-500' : 'text-gray-500'
							}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload Files</span>
            </a>
          </li>
          <li>
            <a 
              href="/snippet" 
              class="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 ${
								currentPage === 'snippet' ? 'bg-primary-50 text-primary-700 font-medium' : ''
							}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 ${
								currentPage === 'snippet' ? 'text-primary-500' : 'text-gray-500'
							}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Create Snippet</span>
            </a>
          </li>
          <li>
            <a 
              id="analytics-link"
              href="/analytics" 
              class="flex items-center rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 ${
								currentPage === 'analytics' ? 'bg-primary-50 text-primary-700 font-medium' : ''
							}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 ${
								currentPage === 'analytics' ? 'text-primary-500' : 'text-gray-500'
							}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analytics</span>
            </a>
          </li>
        </ul>
        
        <div class="mt-auto px-4 md:hidden">
          <div id="sidebar-user-button" class="mt-6"></div>
        </div>
      </div>
    </aside>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      // Wait for Clerk to be loaded
      if (window.Clerk && Clerk.user) {
        // Get the analytics link
        const analyticsLink = document.getElementById('analytics-link');
        if (analyticsLink) {
          // Update the href to include the user ID
          const userId = Clerk.user.id;
          if (userId) {
            const currentHref = analyticsLink.getAttribute('href');
            analyticsLink.setAttribute('href', currentHref + '?userId=' + userId);
          }
        }
      }
    });
  </script>
  `;
}

export { renderSidebar };
