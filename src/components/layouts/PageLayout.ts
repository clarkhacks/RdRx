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
<body class="bg-gray-50 min-h-screen flex flex-col">

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

  <script>
    ${scripts}
  </script>
</body>
</html>
  `;
}

export { renderPageLayout };
