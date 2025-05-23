export function SignupFormUI(): string {
	return `
		<div class="auth-container">
			<div class="auth-card">
				<div class="auth-header">
					<h1>Create Account</h1>
					<p>Join RDRX to start shortening URLs and sharing files</p>
				</div>
				
				<form id="signup-form" class="auth-form">
					<div class="form-group">
						<label for="name">Full Name</label>
						<input 
							type="text" 
							id="name" 
							name="name" 
							required 
							placeholder="Enter your full name"
							autocomplete="name"
						>
						<div class="error-message" id="name-error"></div>
					</div>
					
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
							placeholder="Create a strong password"
							autocomplete="new-password"
						>
						<div class="password-requirements">
							<small>Password must contain:</small>
							<ul>
								<li id="req-length">At least 8 characters</li>
								<li id="req-upper">One uppercase letter</li>
								<li id="req-lower">One lowercase letter</li>
								<li id="req-number">One number</li>
							</ul>
						</div>
						<div class="error-message" id="password-error"></div>
					</div>
					
					<div class="form-group">
						<label for="confirm-password">Confirm Password</label>
						<input 
							type="password" 
							id="confirm-password" 
							name="confirm-password" 
							required 
							placeholder="Confirm your password"
							autocomplete="new-password"
						>
						<div class="error-message" id="confirm-password-error"></div>
					</div>
					
					<button type="submit" class="auth-button" id="signup-button">
						<span class="button-text">Create Account</span>
						<span class="button-loading" style="display: none;">
							<svg class="spinner" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
									<animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
									<animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
								</circle>
							</svg>
							Creating Account...
						</span>
					</button>
				</form>
				
				<div class="auth-footer">
					<p>Already have an account? <a href="/login" class="auth-link">Sign in</a></p>
				</div>
				
				<div id="signup-message" class="message" style="display: none;"></div>
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
				max-width: 450px;
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
			
			.password-requirements {
				margin-top: 8px;
				padding: 12px;
				background: #f8f9fa;
				border-radius: 6px;
				border-left: 4px solid #667eea;
			}
			
			.password-requirements small {
				color: #666;
				font-weight: 500;
				display: block;
				margin-bottom: 8px;
			}
			
			.password-requirements ul {
				margin: 0;
				padding-left: 20px;
				list-style: none;
			}
			
			.password-requirements li {
				color: #999;
				font-size: 13px;
				margin-bottom: 4px;
				position: relative;
			}
			
			.password-requirements li::before {
				content: "✗";
				color: #e74c3c;
				font-weight: bold;
				position: absolute;
				left: -20px;
			}
			
			.password-requirements li.valid::before {
				content: "✓";
				color: #27ae60;
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
			}
		</style>
		
		<script>
			document.addEventListener('DOMContentLoaded', function() {
				const form = document.getElementById('signup-form');
				const nameInput = document.getElementById('name');
				const emailInput = document.getElementById('email');
				const passwordInput = document.getElementById('password');
				const confirmPasswordInput = document.getElementById('confirm-password');
				const submitButton = document.getElementById('signup-button');
				const messageDiv = document.getElementById('signup-message');
				
				// Password validation requirements
				const requirements = {
					length: document.getElementById('req-length'),
					upper: document.getElementById('req-upper'),
					lower: document.getElementById('req-lower'),
					number: document.getElementById('req-number')
				};
				
				// Real-time password validation
				passwordInput.addEventListener('input', function() {
					const password = this.value;
					
					// Check length
					if (password.length >= 8) {
						requirements.length.classList.add('valid');
					} else {
						requirements.length.classList.remove('valid');
					}
					
					// Check uppercase
					if (/[A-Z]/.test(password)) {
						requirements.upper.classList.add('valid');
					} else {
						requirements.upper.classList.remove('valid');
					}
					
					// Check lowercase
					if (/[a-z]/.test(password)) {
						requirements.lower.classList.add('valid');
					} else {
						requirements.lower.classList.remove('valid');
					}
					
					// Check number - explicitly check for digits 0-9
					if (/[0-9]/.test(password)) {
						requirements.number.classList.add('valid');
					} else {
						requirements.number.classList.remove('valid');
					}
					
					// Clear password error
					clearError('password');
				});
				
				// Confirm password validation
				confirmPasswordInput.addEventListener('input', function() {
					if (this.value && this.value !== passwordInput.value) {
						showError('confirm-password', 'Passwords do not match');
					} else {
						clearError('confirm-password');
					}
				});
				
				// Clear errors on input
				[nameInput, emailInput].forEach(input => {
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
						name: formData.get('name').trim(),
						email: formData.get('email').trim(),
						password: formData.get('password')
					};
					
					// Validate form
					let hasErrors = false;
					
					if (!data.name) {
						showError('name', 'Name is required');
						hasErrors = true;
					}
					
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
					} else {
						// Check password requirements
						const password = data.password;
						if (password.length < 8) {
							showError('password', 'Password must be at least 8 characters long');
							hasErrors = true;
						} else if (!/[A-Z]/.test(password)) {
							showError('password', 'Password must contain at least one uppercase letter');
							hasErrors = true;
						} else if (!/[a-z]/.test(password)) {
							showError('password', 'Password must contain at least one lowercase letter');
							hasErrors = true;
						} else if (!/[0-9]/.test(password)) {
							showError('password', 'Password must contain at least one number');
							hasErrors = true;
						}
					}
					
					const confirmPassword = formData.get('confirm-password');
					if (!confirmPassword) {
						showError('confirm-password', 'Please confirm your password');
						hasErrors = true;
					} else if (confirmPassword !== data.password) {
						showError('confirm-password', 'Passwords do not match');
						hasErrors = true;
					}
					
					if (hasErrors) return;
					
					// Show loading state
					setLoading(true);
					
					try {
						const response = await fetch('/api/auth/signup', {
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
							}
							
							showMessage('Account created successfully! Redirecting...', 'success');
							
							// Redirect after a short delay
							setTimeout(() => {
								window.location.href = '/dashboard';
							}, 1500);
						} else {
							showMessage(result.message || 'Failed to create account', 'error');
						}
					} catch (error) {
						console.error('Signup error:', error);
						showMessage('Network error. Please try again.', 'error');
					} finally {
						setLoading(false);
					}
				});
				
				function showError(fieldName, message) {
					const errorDiv = document.getElementById(fieldName + '-error');
					const input = document.getElementById(fieldName) || document.querySelector('[name="' + fieldName + '"]');
					
					if (errorDiv) errorDiv.textContent = message;
					if (input) input.classList.add('error');
				}
				
				function clearError(fieldName) {
					const errorDiv = document.getElementById(fieldName + '-error');
					const input = document.getElementById(fieldName) || document.querySelector('[name="' + fieldName + '"]');
					
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
