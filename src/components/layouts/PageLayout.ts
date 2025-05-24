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
<html lang="en">
${renderDocumentHead({ title, additionalScripts: additionalHeadScripts })}
<body class="bg-surface-light min-h-screen flex flex-col">

  <!-- Header -->
  ${renderHeader()}

  <div class="flex flex-grow">
    <!-- Sidebar -->
    ${renderSidebar(activeNavItem)}
    
    <!-- Main Content -->
    <main class="flex-grow p-4 md:p-8 items-center">
      ${content}
    </main>
  </div>

  <!-- Footer -->
  <footer class="bg-surface-light border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-center items-center gap-4">
        <div>© ${new Date().getFullYear()} RdRx. All rights reserved.</div>
        <div class="flex gap-4">
          <a href="/terms" class="hover:text-primary-500 transition-colors duration-200">Terms of Service</a>
          <a href="/privacy" class="hover:text-primary-500 transition-colors duration-200">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    ${scripts}
  </script>
</body>
</html>
  `;
}

export { renderPageLayout };
