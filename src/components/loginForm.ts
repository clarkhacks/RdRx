interface Env {
	CLERK_PUBLISHABLE_KEY: string; // Clerk Publishable Key
}

function renderLoginPage(env: Env): Response {
	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <meta name="description" content="Login to your account">
    <meta name="keywords" content="login, authentication, user account">
    <meta name="author" content="RdRx Team">
    <meta property="og:title" content="Login to RdRx">
    <meta property="og:description" content="Login to your account on RdRx, the modern URL shortener.">
    <meta property="og:image" content="https://cdn.rdrx.co/banner.jpg">
    <meta property="og:url" content="https://rdrx.co/login">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RdRx">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="Login to RdRx">
    <meta property="twitter:description" content="Login to your account on RdRx, the modern URL shortener.">
    <meta property="twitter:image" content="https://cdn.rdrx.co/banner.jpg">
    <meta property="twitter:url" content="https://rdrx.co/login">
    <link rel="apple-touch-icon" sizes="57x57" href="https://cdn.rdrx.co/favicons/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="https://cdn.rdrx.co/favicons/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="https://cdn.rdrx.co/favicons/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="https://cdn.rdrx.co/favicons/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="https://cdn.rdrx.co/favicons/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="https://cdn.rdrx.co/favicons/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="https://cdn.rdrx.co/favicons/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://cdn.rdrx.co/favicons/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192"  href="https://cdn.rdrx.co/favicons/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="https://cdn.rdrx.co/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="https://cdn.rdrx.co/favicons/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="https://cdn.rdrx.co/favicons/favicon-16x16.png">
    <title>Login</title>
    <script
      crossorigin="anonymous"
      data-clerk-publishable-key="${env.CLERK_PUBLISHABLE_KEY}"
      src="https://grateful-koi-58.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
      type="text/javascript">
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            // Replace with your valid Clerk Publishable Key
            const clerkPubKey = '${env.CLERK_PUBLISHABLE_KEY}';
            if (!clerkPubKey) {
                console.error('Clerk Publishable Key is missing.');
                return;
            }
            try {
                // Initialize Clerk with proper session configuration
                await Clerk.load({
                    publishableKey: clerkPubKey,
                    // Persist the session for 7 days
                    cookieOptions: {
                        secure: true,
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24 * 7 // 7 days
                    }
                });
                
                // Handle the session after loading
                Clerk.addListener(({ user }) => {
                    // This will run when the auth state changes
                    updateUI();
                });
                
                // Initial UI setup
                updateUI();
                
                function updateUI() {
                    if (Clerk.user) {
                        // If the user is signed in, show the UserButton
                        const urlParams = new URLSearchParams(window.location.search);
                        if (urlParams.has('redirect_url')) {
                            // Redirect to the specified URL after sign in
                            window.location.href = urlParams.get('redirect_url');
                        }
                        document.getElementById('app').innerHTML = \`
                            <div id="user-button" class="flex justify-center mt-4"></div>
                            <div class="text-center mt-4 text-green-600">You are logged in!</div>
                        \`;
                        const userButtonDiv = document.getElementById('user-button');
                        Clerk.mountUserButton(userButtonDiv);
                    } else {
                        // If the user is not signed in, show the SignIn component
                        document.getElementById('app').innerHTML = \`
                            <div id="sign-in" class="flex justify-center mt-4"></div>
                        \`;
                        const signInDiv = document.getElementById('sign-in');
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirectUrl = urlParams.get('redirect_url') || '/create';
                        Clerk.mountSignIn(signInDiv, {
                            // After sign in, redirect to home or a protected route
                            afterSignInUrl: redirectUrl,
                            signUpUrl: window.location.origin + '/sign-up',
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to initialize Clerk:', error);
            }
        });
    </script>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
        <div id="app"></div>
    </div>
</body>
</html>
  `;

	// Set proper cache-control headers to ensure the response isn't cached
	return new Response(html, {
		headers: {
			'Content-Type': 'text/html',
			'Cache-Control': 'no-store, must-revalidate',
			Pragma: 'no-cache',
			Expires: '0',
		},
	});
}

export { renderLoginPage };
