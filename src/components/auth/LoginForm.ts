export function LoginFormUI(): string {
	return `
		<div class="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<div class="flex justify-center">
					<img src="https://cdn.rdrx.co/logo.png" alt="RdRx Logo" class="w-12 h-12">
				</div>
				<h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-dark-100">
					Welcome back
				</h2>
				<p class="mt-2 text-center text-sm text-gray-600 dark:text-dark-300">
					Sign in to your RdRx account
				</p>
			</div>

			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white dark:bg-dark-800 py-8 px-4 shadow-github-md dark:shadow-github-dark sm:rounded-github-lg sm:px-10 border border-gray-200 dark:border-dark-600">
					<form id="login-form" class="space-y-6">
						<div>
							<label for="email" class="block text-sm font-semibold text-gray-900 dark:text-dark-100">
								Email address
							</label>
							<div class="mt-1">
								<input 
									id="email" 
									name="email" 
									type="email" 
									autocomplete="email" 
									required 
									placeholder="Enter your email"
									class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github placeholder-gray-400 dark:placeholder-dark-400 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
								>
								<div class="error-message text-red-500 dark:text-red-400 text-sm mt-1 min-h-[20px]" id="email-error"></div>
							</div>
						</div>

						<div>
							<label for="password" class="block text-sm font-semibold text-gray-900 dark:text-dark-100">
								Password
							</label>
							<div class="mt-1">
								<input 
									id="password" 
									name="password" 
									type="password" 
									autocomplete="current-password" 
									required 
									placeholder="Enter your password"
									class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-github placeholder-gray-400 dark:placeholder-dark-400 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
								>
								<div class="error-message text-red-500 dark:text-red-400 text-sm mt-1 min-h-[20px]" id="password-error"></div>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<input 
									id="remember" 
									name="remember" 
									type="checkbox" 
									class="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-dark-600 rounded"
								>
								<label for="remember" class="ml-2 block text-sm text-gray-900 dark:text-dark-100">
									Remember me
								</label>
							</div>

							<div class="text-sm">
								<a href="/forgot-password" class="font-medium text-blue-500 hover:text-blue-400 transition-colors duration-200">
									Forgot your password?
								</a>
							</div>
						</div>

						<div>
							<button 
								type="submit" 
								id="login-button"
								class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-github text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 dark:focus:ring-offset-dark-800 shadow-github hover:shadow-github-md transition-all duration-200"
							>
								<span class="button-text flex items-center">
									<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
									</svg>
									Sign in
								</span>
								<span class="button-loading hidden items-center">
									<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Signing in...
								</span>
							</button>
						</div>
					</form>

					<div class="mt-6">
						<div class="relative">
							<div class="absolute inset-0 flex items-center">
								<div class="w-full border-t border-gray-300 dark:border-dark-600" />
							</div>
							<div class="relative flex justify-center text-sm">
								<span class="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-dark-400">
									Don't have an account?
								</span>
							</div>
						</div>

						<div class="mt-6">
							<a 
								href="/coming-soon" 
								class="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-dark-600 rounded-github shadow-github text-sm font-medium text-gray-700 dark:text-dark-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-800 transition-colors duration-200"
							>
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
								</svg>
								Create account
							</a>
						</div>
					</div>

					<div id="login-message" class="mt-4 hidden"></div>
				</div>
			</div>
		</div>
		
		<script>
			document.addEventListener('DOMContentLoaded', function() {
				const form = document.getElementById('login-form');
				const emailInput = document.getElementById('email');
				const passwordInput = document.getElementById('password');
				const submitButton = document.getElementById('login-button');
				const messageDiv = document.getElementById('login-message');
				
				// Clear errors on input
				[emailInput, passwordInput].forEach(input => {
					input.addEventListener('input', function() {
						clearError(this.name);
					});
				});
				
				// Form submission
				form.addEventListener('submit', async function(e) {
					e.preventDefault();
					
					// Clear previous errors
					clearAllErrors();
					hideMessage();
					
					// Get form data
					const formData = new FormData(form);
					const data = {
						email: formData.get('email').trim(),
						password: formData.get('password')
					};
					
					// Validate form
					let hasErrors = false;
					
					if (!data.email) {
						showError('email', 'Email is required');
						hasErrors = true;
					} else {
					 // Check for @ sign and . using contains
						if (!data.email.includes('@') || !data.email.includes('.')) {
							showError('email', 'Invalid email address');
							hasErrors = true;
						}
					}
					
					if (!data.password) {
						showError('password', 'Password is required');
						hasErrors = true;
					}
					
					if (hasErrors) return;
					
					// Show loading state
					setLoading(true);
					
					try {
						const response = await fetch('/api/auth/login', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(data)
						});
						
						const result = await response.json();
						
						if (result.success) {
							// Store token
							if (result.token) {
								localStorage.setItem('auth_token', result.token);
								
								// Set cookie for server-side access
								const remember = formData.get('remember');
								const expires = remember ? 
									new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : // 30 days
									new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
								
								document.cookie = \`auth_token=\${result.token}; expires=\${expires.toUTCString()}; path=/; secure; samesite=strict\`;
							}
							
							showMessage('Login successful! Redirecting...', 'success');
							
							// Redirect after a short delay
							setTimeout(() => {
								const urlParams = new URLSearchParams(window.location.search);
								const redirect = urlParams.get('redirect') || '/create';
								window.location.href = redirect;
							}, 1500);
						} else {
							showMessage(result.message || 'Login failed', 'error');
						}
					} catch (error) {
						console.error('Login error:', error);
						showMessage('Network error. Please try again.', 'error');
					} finally {
						setLoading(false);
					}
				});
				
				function showError(fieldName, message) {
					const errorDiv = document.getElementById(fieldName + '-error');
					const input = document.getElementById(fieldName);
					
					if (errorDiv) errorDiv.textContent = message;
					if (input) input.classList.add('error');
				}
				
				function clearError(fieldName) {
					const errorDiv = document.getElementById(fieldName + '-error');
					const input = document.getElementById(fieldName);
					
					if (errorDiv) errorDiv.textContent = '';
					if (input) input.classList.remove('error');
				}
				
				function clearAllErrors() {
					document.querySelectorAll('.error-message').forEach(div => div.textContent = '');
					document.querySelectorAll('input.error').forEach(input => input.classList.remove('error'));
				}
				
				function showMessage(message, type) {
					messageDiv.textContent = message;
					messageDiv.className = 'message ' + type;
					messageDiv.style.display = 'block';
				}
				
				function hideMessage() {
					messageDiv.style.display = 'none';
				}
				
				function setLoading(loading) {
					submitButton.disabled = loading;
					document.querySelector('.button-text').style.display = loading ? 'none' : 'inline';
					document.querySelector('.button-loading').style.display = loading ? 'flex' : 'none';
				}
			});
		</script>
	`;
}
