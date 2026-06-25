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
          <a href="#" id="report-bug-link" class="hover:text-primary-500 transition-colors duration-200 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Report Bug
          </a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Bug report link with prefilled data
    document.getElementById('report-bug-link')?.addEventListener('click', function(e) {
      e.preventDefault();
      
      const bugReport = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        viewport: window.innerWidth + 'x' + window.innerHeight,
        referrer: document.referrer || 'Direct'
      };
      
      const title = encodeURIComponent('Bug Report: [Brief Description]');
      const body = encodeURIComponent(
        '## Bug Description\\n' +
        'Please describe the bug you encountered...\\n\\n' +
        '## Steps to Reproduce\\n' +
        '1. \\n' +
        '2. \\n' +
        '3. \\n\\n' +
        '## Expected Behavior\\n' +
        'What should have happened...\\n\\n' +
        '## Actual Behavior\\n' +
        'What actually happened...\\n\\n' +
        '## Environment\\n' +
        '- **URL**: ' + bugReport.url + '\\n' +
        '- **Browser**: ' + bugReport.userAgent + '\\n' +
        '- **Viewport**: ' + bugReport.viewport + '\\n' +
        '- **Referrer**: ' + bugReport.referrer + '\\n' +
        '- **Timestamp**: ' + bugReport.timestamp + '\\n\\n' +
        '## Additional Context\\n' +
        'Add any other context about the problem here...'
      );
      
      const githubUrl = 'https://github.com/clarkhacks/RdRx/issues/new?title=' + title + '&body=' + body + '&labels=bug';
      window.open(githubUrl, '_blank');
    });
    
    ${scripts}
  </script>
</body>
</html>
  `;
}

export { renderPageLayout };
