function renderHeader(): string {
	return `
  <header class="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
    <a href="/" class="flex items-center gap-2">
      <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-8 h-8">
      <span class="text-2xl font-bold text-gray-800">RdRx</span>
    </a>
    
    <div class="flex items-center">
      <!-- User Dropdown Menu -->
      <div id="user-dropdown" class="relative" x-data="{ open: false }">
        <button 
          @click="open = !open" 
          class="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          id="user-menu-button"
        >
          <div id="user-avatar" class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <span id="user-initials">?</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <div 
          x-show="open" 
          @click.away="open = false"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          style="display: none;"
        >
          <a href="/account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Account Settings
          </a>
          <button 
            id="logout-button" 
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
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
          userMenuButton.outerHTML = '<a href="/login" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Login</a>';
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
