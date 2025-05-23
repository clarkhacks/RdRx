export function LoginFormUI(): string {
	return `
		<div class="auth-container">
			<div class="auth-card">
				<div class="auth-header">
					<h1>Welcome Back</h1>
					<p>Sign in to your RDRX account</p>
				</div>
				
				<form id="login-form" class="auth-form">
					<div class="form-group">
						<label for="email">Email Address</label>
						<input 
							type="email" 
							id="email" 
							name="email" 
							required 
							placeholder="Enter your email"
							autocomplete="email"
						>
						<div class="error-message" id="email-error"></div>
					</div>
					
					<div class="form-group">
						<label for="password">Password</label>
						<input 
							type="password" 
							id="password" 
							name="password" 
							required 
							placeholder="Enter your password"
							autocomplete="current-password"
						>
						<div class="error-message" id="password-error"></div>
					</div>
					
					<div class="form-options">
						<label class="checkbox-container">
							<input type="checkbox" id="remember" name="remember">
							<span class="checkmark"></span>
							Remember me
						</label>
						<a href="/forgot-password" class="forgot-link">Forgot password?</a>
					</div>
					
					<button type="submit" class="auth-button" id="login-button">
						<span class="button-text">Sign In</span>
						<span class="button-loading" style="display: none;">
							<svg class="spinner" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
									<animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
									<animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
								</circle>
							</svg>
							Signing In...
						</span>
					</button>
				</form>
				
				<div class="auth-footer">
					<p>Don't have an account? <a href="/signup" class="auth-link">Create one</a></p>
				</div>
				
				<div id="login-message" class="message" style="display: none;"></div>
			</div>
		</div>
		
		<style>
			.auth-container {
				min-height: 100vh;
				display: flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				padding: 20px;
			}
			
			.auth-card {
				background: white;
				border-radius: 12px;
				box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
				padding: 40px;
				width: 100%;
				max-width: 400px;
			}
			
			.auth-header {
				text-align: center;
				margin-bottom: 30px;
			}
			
			.auth-header h1 {
				color: #333;
				font-size: 28px;
				font-weight: 600;
				margin: 0 0 10px 0;
			}
			
			.auth-header p {
				color: #666;
				font-size: 16px;
				margin: 0;
			}
			
			.auth-form {
				display: flex;
				flex-direction: column;
				gap: 20px;
			}
			
			.form-group {
				display: flex;
				flex-direction: column;
			}
			
			.form-group label {
				color: #333;
				font-weight: 500;
				margin-bottom: 8px;
				font-size: 14px;
			}
			
			.form-group input {
				padding: 12px 16px;
				border: 2px solid #e1e5e9;
				border-radius: 8px;
				font-size: 16px;
				transition: border-color 0.2s ease;
				background: #fff;
			}
			
			.form-group input:focus {
				outline: none;
				border-color: #667eea;
				box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
			}
			
			.form-group input.error {
				border-color: #e74c3c;
			}
			
			.form-options {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 10px 0;
			}
			
			.checkbox-container {
				display: flex;
				align-items: center;
				cursor: pointer;
				font-size: 14px;
				color: #666;
				user-select: none;
			}
			
			.checkbox-container input[type="checkbox"] {
				display: none;
			}
			
			.checkmark {
				width: 18px;
				height: 18px;
				border: 2px solid #e1e5e9;
				border-radius: 4px;
				margin-right: 8px;
				position: relative;
				transition: all 0.2s ease;
			}
			
			.checkbox-container input[type="checkbox"]:checked + .checkmark {
				background: #667eea;
				border-color: #667eea;
			}
			
			.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
				content: "✓";
				position: absolute;
				top: -2px;
				left: 2px;
				color: white;
				font-size: 12px;
				font-weight: bold;
			}
			
			.forgot-link {
				color: #667eea;
				text-decoration: none;
				font-size: 14px;
				font-weight: 500;
			}
			
			.forgot-link:hover {
				text-decoration: underline;
			}
			
			.error-message {
				color: #e74c3c;
				font-size: 13px;
				margin-top: 6px;
				min-height: 18px;
			}
			
			.auth-button {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				border: none;
				padding: 14px 24px;
				border-radius: 8px;
				font-size: 16px;
				font-weight: 600;
				cursor: pointer;
				transition: all 0.2s ease;
				position: relative;
				overflow: hidden;
			}
			
			.auth-button:hover:not(:disabled) {
				transform: translateY(-2px);
				box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
			}
			
			.auth-button:disabled {
				opacity: 0.7;
				cursor: not-allowed;
				transform: none;
			}
			
			.button-loading {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
			}
			
			.spinner {
				width: 20px;
				height: 20px;
			}
			
			.auth-footer {
				text-align: center;
				margin-top: 30px;
				padding-top: 20px;
				border-top: 1px solid #e1e5e9;
			}
			
			.auth-footer p {
				color: #666;
				margin: 0;
			}
			
			.auth-link {
				color: #667eea;
				text-decoration: none;
				font-weight: 500;
			}
			
			.auth-link:hover {
				text-decoration: underline;
			}
			
			.message {
				margin-top: 20px;
				padding: 12px 16px;
				border-radius: 8px;
				font-size: 14px;
				text-align: center;
			}
			
			.message.success {
				background: #d4edda;
				color: #155724;
				border: 1px solid #c3e6cb;
			}
			
			.message.error {
				background: #f8d7da;
				color: #721c24;
				border: 1px solid #f5c6cb;
			}
			
			@media (max-width: 480px) {
				.auth-container {
					padding: 10px;
				}
				
				.auth-card {
					padding: 30px 20px;
				}
				
				.auth-header h1 {
					font-size: 24px;
				}
				
				.form-options {
					flex-direction: column;
					gap: 15px;
					align-items: flex-start;
				}
			}
		</style>
		
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
								const redirect = urlParams.get('redirect') || '/dashboard';
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
