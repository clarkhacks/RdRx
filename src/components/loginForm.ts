interface Env {}

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
    <meta property="og:image" content="/assets/banner.jpg">
    <meta property="og:url" content="https://rdrx.co/login">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RdRx">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="Login to RdRx">
    <meta property="twitter:description" content="Login to your account on RdRx, the modern URL shortener.">
    <meta property="twitter:image" content="/assets/banner.jpg">
    <meta property="twitter:url" content="https://rdrx.co/login">
    <link rel="apple-touch-icon" sizes="57x57" href="/assets/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="/assets/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="/assets/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="/assets/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="/assets/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="/assets/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="/assets/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="/assets/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192"  href="/assets/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
        <div id="app">
            <form id="login-form" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                    <input type="email" name="email" id="email" autocomplete="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" id="password" autocomplete="current-password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
                    </div>

                    <div class="text-sm">
                        <a href="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
                    </div>
                </div>

                <div>
                    <button type="submit" id="login-button" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span class="button-text">Sign in</span>
                        <span class="button-loading hidden">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </span>
                    </button>
                </div>
                
                <div id="error-message" class="text-red-500 text-center hidden"></div>
            </form>
            
            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Don't have an account?</span>
                    </div>
                </div>

                <div class="mt-6">
                    <a href="/coming-soon" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('login-form');
            const loginButton = document.getElementById('login-button');
            const buttonText = document.querySelector('.button-text');
            const buttonLoading = document.querySelector('.button-loading');
            const errorMessage = document.getElementById('error-message');
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Show loading state
                loginButton.disabled = true;
                buttonText.classList.add('hidden');
                buttonLoading.classList.remove('hidden');
                errorMessage.classList.add('hidden');
                
                const formData = new FormData(form);
                const email = formData.get('email');
                const password = formData.get('password');
                const rememberMe = formData.get('remember-me') === 'on';
                
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            password,
                            remember: rememberMe
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Store token in localStorage for client-side access
                        // The secure HttpOnly cookie is set by the server
                        if (data.token) {
                            localStorage.setItem('auth_token', data.token);
                        }
                        
                        // Redirect to the specified URL or default to create page
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirectUrl = urlParams.get('redirect_url') || '/create';
                        window.location.href = redirectUrl;
                    } else {
                        // Show error message
                        errorMessage.textContent = data.message || 'Invalid email or password';
                        errorMessage.classList.remove('hidden');
                        
                        // Reset button state
                        loginButton.disabled = false;
                        buttonText.classList.remove('hidden');
                        buttonLoading.classList.add('hidden');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    errorMessage.textContent = 'An error occurred. Please try again.';
                    errorMessage.classList.remove('hidden');
                    
                    // Reset button state
                    loginButton.disabled = false;
                    buttonText.classList.remove('hidden');
                    buttonLoading.classList.add('hidden');
                }
            });
        });
    </script>
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
