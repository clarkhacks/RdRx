function renderHeader(): string {
	return `
  <header class="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600 py-3 px-6 flex justify-between items-center sticky top-0 z-40 transition-colors duration-200">
    <a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
      <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-8 h-8">
      <span class="text-xl font-semibold text-gray-900 dark:text-dark-100">RdRx</span>
    </a>
    
    <div class="flex items-center gap-3">
      <!-- User Dropdown Menu -->
      <div id="user-dropdown" class="relative" x-data="{ open: false }">
        <button 
          @click="open = !open" 
          class="flex items-center gap-2 text-gray-700 dark:text-dark-300 hover:text-gray-900 dark:hover:text-dark-100 focus:outline-none transition-colors duration-200 p-2 rounded-github hover:bg-gray-100 dark:hover:bg-dark-700"
          id="user-menu-button"
        >
          <div id="user-avatar" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-600 flex items-center justify-center text-gray-600 dark:text-dark-300 border border-gray-200 dark:border-dark-500">
            <span id="user-initials" class="text-sm font-medium">?</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <div 
          x-show="open" 
          @click.away="open = false"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-github-md shadow-github-md dark:shadow-github-dark border border-gray-200 dark:border-dark-600 py-1 z-50"
          style="display: none;"
        >
          <a href="/dashboard" class="block px-3 py-2 text-sm text-gray-700 dark:text-dark-200 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 rounded-github mx-1">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              Dashboard
            </div>
          </a>
          <a href="/account" class="block px-3 py-2 text-sm text-gray-700 dark:text-dark-200 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 rounded-github mx-1">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Account Settings
            </div>
          </a>
          <hr class="my-1 border-gray-200 dark:border-dark-600">
          <button 
            id="logout-button" 
            class="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-dark-200 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors duration-200 rounded-github mx-1"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign Out
            </div>
          </button>
        </div>
      </div>
    </div>
  </header>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Check if user is logged in
      const token = localStorage.getItem('auth_token') || getCookie('auth_token');
      const userInitials = document.getElementById('user-initials');
      const userAvatar = document.getElementById('user-avatar');
      const userMenuButton = document.getElementById('user-menu-button');
      const logoutButton = document.getElementById('logout-button');
      
      if (!token) {
          // If not logged in, show login button instead
          if (userMenuButton) {
            userMenuButton.outerHTML = '<div class="flex items-center gap-3"><a href="/login" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors duration-200">Login</a><a href="/coming-soon" class="btn-playful text-sm py-2 px-4">Sign Up</a></div>';
          }
        return;
      }
      
      // Fetch user data
      fetch('/api/auth/me', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.user) {
          // Set user initials
          if (userInitials && data.user.name) {
            const names = data.user.name.split(' ');
            if (names.length > 1) {
              userInitials.textContent = (names[0][0] + names[1][0]).toUpperCase();
            } else {
              userInitials.textContent = names[0][0].toUpperCase();
            }
          }
          
          // If user has profile picture, show it
          if (data.user.profile_picture_url && userAvatar) {
            userAvatar.innerHTML = \`<img src="\${data.user.profile_picture_url}" alt="Profile" class="w-8 h-8 rounded-full object-cover">\`;
          }
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
      
      // Handle logout
      if (logoutButton) {
        logoutButton.addEventListener('click', function() {
          // Clear auth token from localStorage
          localStorage.removeItem('auth_token');
          
          // Call logout API to clear the HttpOnly cookie
          fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'same-origin'
          })
          .then(() => {
            // Redirect to home page
            window.location.href = '/';
          })
          .catch(error => {
            console.error('Logout error:', error);
            // Even if the API call fails, redirect to home page
            window.location.href = '/';
          });
        });
      }
      
      // Helper function to get cookie value
      function getCookie(name) {
        const value = \`; \${document.cookie}\`;
        const parts = value.split(\`; \${name}=\`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }
    });
  </script>
    `;
}

export { renderHeader };
