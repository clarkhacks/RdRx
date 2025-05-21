import { renderDocumentHead } from './DocumentHead';

interface PageLayoutProps {
	title: string;
	content: string;
	scripts?: string;
	additionalHeadScripts?: string;
}

function renderPageLayout({ title, content, scripts = '', additionalHeadScripts = '' }: PageLayoutProps): string {
	return `
<!DOCTYPE html>
<html lang="en">
${renderDocumentHead({ title, additionalScripts: additionalHeadScripts })}
<body class="bg-gray-50 min-h-screen flex flex-col">

  <div class="flex flex-grow">
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
