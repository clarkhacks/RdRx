function renderPublicNavbar(): string {
	return `
    <nav 
      x-data="{ open: false }"
      class="bg-white shadow-md py-3 px-6 flex items-center justify-between sticky top-0 z-50 rounded-full mx-4 my-3 card-container"
    >
        <a href="/" class="flex items-center gap-2">
            <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-8 h-8">
            <span class="text-xl font-bold text-gray-800">RdRx</span>
        </a>
        
        <!-- Mobile menu button -->
        <button 
          @click="open = !open"
          class="md:hidden ml-auto text-gray-700 hover:text-primary-500 focus:outline-none"
          aria-label="Open Menu"
        >
          <svg x-show="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg x-show="open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Desktop & mobile nav links -->
        <div 
          class="flex items-center gap-4"
          :class="{'hidden': !open, 'flex flex-col absolute top-16 left-0 w-full bg-white shadow-md rounded-b-2xl z-50 py-4': open, 'md:flex md:static md:flex-row md:gap-4 md:py-0': true}"
        >
            <a href="/login" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors duration-200">Login</a>
            <a href="/coming-soon" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors duration-200">Sign Up</a>
            <a href="https://github.com/clarkhacks/RdRx" target="_blank" class="btn-playful btn-outline text-sm py-2 px-4">
                <i class="fab fa-github mr-1"></i> GitHub
            </a>
        </div>
    </nav>
    <style>
      @media (max-width: 768px) {
        nav .flex.items-center.gap-4 {
          display: none;
        }
        nav .flex.items-center.gap-4.flex {
          display: flex !important;
        }
      }
    </style>
    `;
}

export { renderPublicNavbar };
