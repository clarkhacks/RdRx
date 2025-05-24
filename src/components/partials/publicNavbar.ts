function renderPublicNavbar(): string {
	return `
    <nav class="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <a href="/" class="flex items-center gap-2">
            <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-8 h-8">
            <span class="text-xl font-medium text-gray-800">RdRx</span>
        </a>
        
        <div class="flex items-center gap-4">
            <a href="/login" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm transition-colors duration-200">Login</a>
            <a href="/coming-soon" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm transition-colors duration-200">Sign Up (Coming Soon)</a>
            <a href="https://github.com/clarkhacks/RdRx" target="_blank" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm transition-colors duration-200">
                <i class="fab fa-github mr-1"></i> GitHub
            </a>
        </div>
    </nav>
    `;
}

export { renderPublicNavbar };
