import { renderHeader } from '../partials/header';
import { renderSidebar } from '../partials/sidebar';
import { renderDocumentHead } from './DocumentHead';

interface PageLayoutProps {
	title: string;
	activeNavItem?: string;
	content: string;
	scripts?: string;
	additionalHeadScripts?: string;
}

function renderPageLayout({ title, activeNavItem = '', content, scripts = '', additionalHeadScripts = '' }: PageLayoutProps): string {
	return `
<!DOCTYPE html>
<html lang="en" class="h-full">
${renderDocumentHead({ title, additionalScripts: additionalHeadScripts })}
<body class="bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-dark-100 min-h-screen flex flex-col transition-colors duration-200">

  <!-- Dark Mode Toggle Button -->
  <button id="theme-toggle" class="fixed top-4 right-4 z-50 p-2 rounded-github bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 shadow-github hover:shadow-github-md transition-all duration-200">
    <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5 text-gray-600 dark:text-dark-300" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
    </svg>
    <svg id="theme-toggle-light-icon" class="hidden w-5 h-5 text-gray-600 dark:text-dark-300" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
    </svg>
  </button>

  <!-- Header -->
  ${renderHeader()}

  <div class="flex flex-grow">
    <!-- Sidebar -->
    ${renderSidebar(activeNavItem)}
    
    <!-- Main Content -->
    <main class="flex-grow p-4 md:p-8 bg-white dark:bg-dark-800 border-l border-gray-200 dark:border-dark-600">
      ${content}
    </main>
  </div>

  <!-- Footer -->
  <footer class="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-600 py-4 px-6 text-center text-sm text-gray-600 dark:text-dark-300">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-center items-center gap-4">
        <div>© ${new Date().getFullYear()} RdRx. All rights reserved.</div>
        <div class="flex gap-4">
          <a href="/terms" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">Terms of Service</a>
          <a href="/privacy" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Dark mode toggle functionality
    document.addEventListener('DOMContentLoaded', function() {
      const themeToggle = document.getElementById('theme-toggle');
      const darkIcon = document.getElementById('theme-toggle-dark-icon');
      const lightIcon = document.getElementById('theme-toggle-light-icon');
      
      // Check for saved theme preference or default to 'light' mode
      const currentTheme = localStorage.getItem('theme') || 'light';
      
      function updateTheme(theme) {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          darkIcon.classList.add('hidden');
          lightIcon.classList.remove('hidden');
        } else {
          document.documentElement.classList.remove('dark');
          lightIcon.classList.add('hidden');
          darkIcon.classList.remove('hidden');
        }
      }
      
      // Set initial theme
      updateTheme(currentTheme);
      
      // Toggle theme on button click
      themeToggle.addEventListener('click', function() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        localStorage.setItem('theme', newTheme);
        updateTheme(newTheme);
      });
    });
    
    ${scripts}
  </script>
</body>
</html>
  `;
}

export { renderPageLayout };
