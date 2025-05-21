function renderHeader(): string {
	return `
  <header class="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
    <a href="/" class="flex items-center gap-2">
      <img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-8 h-8">
      <span class="text-2xl font-bold text-gray-800">RdRx</span>
    </a>
    
    <div class="flex items-center">
      <!-- User Button -->
      <div id="user-button-desktop"></div>
    </div>
  </header>
    `;
}

export { renderHeader };
