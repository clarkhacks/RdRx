import { renderHeader } from '../partials/header';
import { renderSidebar } from '../partials/sidebar';
import { renderDocumentHead } from './DocumentHead';

interface PageLayoutProps {
	title: string;
	clerkPublishableKey: string;
	activeNavItem?: string;
	content: string;
	scripts?: string;
	additionalHeadScripts?: string;
}

function renderPageLayout({
	title,
	clerkPublishableKey,
	activeNavItem = '',
	content,
	scripts = '',
	additionalHeadScripts = '',
}: PageLayoutProps): string {
	return `
<!DOCTYPE html>
<html lang="en">
${renderDocumentHead({ title, clerkPublishableKey, additionalScripts: additionalHeadScripts })}
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
    document.addEventListener('DOMContentLoaded', async () => {
      const clerkPubKey = '${clerkPublishableKey}';

      if (!clerkPubKey) {
        console.error('Clerk Publishable Key is missing.');
        return;
      }

      try {
        // Initialize Clerk with the publishable key
        await Clerk.load({ publishableKey: clerkPubKey });

        if (Clerk.user) {
          // If the user is signed in, show the UserButton
          const userButtonDiv = document.getElementById('user-button');
          Clerk.mountUserButton(userButtonDiv);
          
          const userButtonDesktop = document.getElementById('user-button-desktop');
          if (userButtonDesktop) {
            Clerk.mountUserButton(userButtonDesktop);
          }
          
          const sidebarUserButton = document.getElementById('sidebar-user-button');
          if (sidebarUserButton) {
            Clerk.mountUserButton(sidebarUserButton);
          }
        }
      } catch (error) {
        console.error('Failed to initialize Clerk:', error);
      }
    });
    
    ${scripts}
  </script>
</body>
</html>
  `;
}

export { renderPageLayout };
