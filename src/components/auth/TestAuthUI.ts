export function TestAuthUI(): string {
	return `
		<div class="test-auth-container">
			<div class="test-header">
				<h1>🔐 Custom Auth Test Suite</h1>
				<p>Test the custom authentication system functionality</p>
			</div>
			
			<div class="test-grid">
				<!-- Signup Test -->
				<div class="test-card">
					<h2>📝 Test Signup</h2>
					<form id="test-signup-form" class="test-form">
						<input type="text" id="signup-name" placeholder="Full Name" required>
						<input type="email" id="signup-email" placeholder="Email" required>
						<input type="password" id="signup-password" placeholder="Password (8+ chars, A-z, 0-9)" required>
						<button type="submit">Test Signup</button>
					</form>
					<div id="signup-result" class="result"></div>
				</div>

				<!-- Login Test -->
				<div class="test-card">
					<h2>🔑 Test Login</h2>
					<form id="test-login-form" class="test-form">
						<input type="email" id="login-email" placeholder="Email" required>
						<input type="password" id="login-password" placeholder="Password" required>
						<button type="submit">Test Login</button>
					</form>
					<div id="login-result" class="result"></div>
				</div>

				<!-- Password Reset Test -->
				<div class="test-card">
					<h2>🔄 Test Password Reset</h2>
					<form id="test-reset-form" class="test-form">
						<input type="email" id="reset-email" placeholder="Email" required>
						<button type="submit">Test Reset Request</button>
					</form>
					<div id="reset-result" class="result"></div>
				</div>

				<!-- Current User Test -->
				<div class="test-card">
					<h2>👤 Test Current User</h2>
					<button id="test-me-btn" class="test-btn">Get Current User</button>
					<div id="me-result" class="result"></div>
				</div>

				<!-- Quick Actions -->
				<div class="test-card">
					<h2>⚡ Quick Actions</h2>
					<div class="quick-actions">
						<button id="clear-storage-btn" class="test-btn secondary">Clear Local Storage</button>
						<button id="view-storage-btn" class="test-btn secondary">View Stored Token</button>
						<button id="test-all-btn" class="test-btn primary">Run All Tests</button>
					</div>
					<div id="quick-result" class="result"></div>
				</div>

				<!-- API Test -->
				<div class="test-card">
					<h2>🔧 Raw API Test</h2>
					<select id="api-method">
						<option value="POST">POST</option>
						<option value="GET">GET</option>
					</select>
					<input type="text" id="api-endpoint" placeholder="/api/auth/signup" value="/api/auth/me">
					<textarea id="api-body" placeholder='{"name":"Test","email":"test@example.com","password":"Test123"}'></textarea>
					<button id="test-api-btn" class="test-btn">Send API Request</button>
					<div id="api-result" class="result"></div>
				</div>
			</div>
		</div>

		<style>
			.test-auth-container {
				min-height: 100vh;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				padding: 20px;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			}

			.test-header {
				text-align: center;
				color: white;
				margin-bottom: 30px;
			}

			.test-header h1 {
				font-size: 2.5rem;
				margin: 0 0 10px 0;
				text-shadow: 0 2px 4px rgba(0,0,0,0.3);
			}

			.test-header p {
				font-size: 1.1rem;
				opacity: 0.9;
				margin: 0;
			}

			.test-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
				gap: 20px;
				max-width: 1200px;
				margin: 0 auto;
			}

			.test-card {
				background: white;
				border-radius: 12px;
				padding: 24px;
				box-shadow: 0 8px 32px rgba(0,0,0,0.1);
				transition: transform 0.2s ease;
			}

			.test-card:hover {
				transform: translateY(-2px);
			}

			.test-card h2 {
				margin: 0 0 20px 0;
				color: #333;
				font-size: 1.3rem;
				border-bottom: 2px solid #f0f0f0;
				padding-bottom: 10px;
			}

			.test-form {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}

			.test-form input, .test-form textarea, .test-form select {
				padding: 12px;
				border: 2px solid #e1e5e9;
				border-radius: 8px;
				font-size: 14px;
				transition: border-color 0.2s ease;
			}

			.test-form input:focus, .test-form textarea:focus, .test-form select:focus {
				outline: none;
				border-color: #667eea;
				box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
			}

			.test-form textarea {
				min-height: 80px;
				resize: vertical;
				font-family: monospace;
			}

			.test-form button, .test-btn {
				padding: 12px 20px;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				border: none;
				border-radius: 8px;
				font-size: 14px;
				font-weight: 600;
				cursor: pointer;
				transition: all 0.2s ease;
			}

			.test-btn.secondary {
				background: #6c757d;
			}

			.test-btn.primary {
				background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
			}

			.test-form button:hover, .test-btn:hover {
				transform: translateY(-1px);
				box-shadow: 0 4px 12px rgba(0,0,0,0.2);
			}

			.test-form button:disabled, .test-btn:disabled {
				opacity: 0.6;
				cursor: not-allowed;
				transform: none;
			}

			.quick-actions {
				display: flex;
				flex-direction: column;
				gap: 10px;
			}

			.result {
				margin-top: 15px;
				padding: 12px;
				border-radius: 6px;
				font-size: 13px;
				font-family: monospace;
				white-space: pre-wrap;
				max-height: 200px;
				overflow-y: auto;
				border: 1px solid #e1e5e9;
				background: #f8f9fa;
			}

			.result.success {
				background: #d4edda;
				border-color: #c3e6cb;
				color: #155724;
			}

			.result.error {
				background: #f8d7da;
				border-color: #f5c6cb;
				color: #721c24;
			}

			.result.info {
				background: #d1ecf1;
				border-color: #bee5eb;
				color: #0c5460;
			}

			@media (max-width: 768px) {
				.test-grid {
					grid-template-columns: 1fr;
				}
				
				.test-header h1 {
					font-size: 2rem;
				}
				
				.quick-actions {
					flex-direction: column;
				}
			}
		</style>

		<script>
			document.addEventListener('DOMContentLoaded', function() {
				// Test Signup
				document.getElementById('test-signup-form').addEventListener('submit', async function(e) {
					e.preventDefault();
					const resultDiv = document.getElementById('signup-result');
					
					const data = {
						name: document.getElementById('signup-name').value,
						email: document.getElementById('signup-email').value,
						password: document.getElementById('signup-password').value
					};
					
					await testAPI('POST', '/api/auth/signup', data, resultDiv);
				});

				// Test Login
				document.getElementById('test-login-form').addEventListener('submit', async function(e) {
					e.preventDefault();
					const resultDiv = document.getElementById('login-result');
					
					const data = {
						email: document.getElementById('login-email').value,
						password: document.getElementById('login-password').value
					};
					
					await testAPI('POST', '/api/auth/login', data, resultDiv);
				});

				// Test Password Reset
				document.getElementById('test-reset-form').addEventListener('submit', async function(e) {
					e.preventDefault();
					const resultDiv = document.getElementById('reset-result');
					
					const data = {
						email: document.getElementById('reset-email').value
					};
					
					await testAPI('POST', '/api/auth/reset-password', data, resultDiv);
				});

				// Test Current User
				document.getElementById('test-me-btn').addEventListener('click', async function() {
					const resultDiv = document.getElementById('me-result');
					await testAPI('GET', '/api/auth/me', null, resultDiv);
				});

				// Clear Storage
				document.getElementById('clear-storage-btn').addEventListener('click', function() {
					localStorage.removeItem('auth_token');
					document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
					document.getElementById('quick-result').textContent = 'Storage cleared!';
					document.getElementById('quick-result').className = 'result success';
				});

				// View Storage
				document.getElementById('view-storage-btn').addEventListener('click', function() {
					const token = localStorage.getItem('auth_token');
					const resultDiv = document.getElementById('quick-result');
					resultDiv.textContent = token ? \`Token: \${token.substring(0, 50)}...\` : 'No token found';
					resultDiv.className = token ? 'result info' : 'result error';
				});

				// Test All
				document.getElementById('test-all-btn').addEventListener('click', async function() {
					const resultDiv = document.getElementById('quick-result');
					resultDiv.textContent = 'Running all tests...\\n';
					resultDiv.className = 'result info';
					
					// Test signup with random email
					const randomEmail = \`test\${Date.now()}@example.com\`;
					const signupData = {
						name: 'Test User',
						email: randomEmail,
						password: 'TestPass123'
					};
					
					resultDiv.textContent += '1. Testing signup...\\n';
					const signupResult = await testAPI('POST', '/api/auth/signup', signupData, null, false);
					resultDiv.textContent += \`   Signup: \${signupResult.success ? 'SUCCESS' : 'FAILED'}\\n\`;
					
					if (signupResult.success) {
						resultDiv.textContent += '2. Testing login...\\n';
						const loginData = { email: randomEmail, password: 'TestPass123' };
						const loginResult = await testAPI('POST', '/api/auth/login', loginData, null, false);
						resultDiv.textContent += \`   Login: \${loginResult.success ? 'SUCCESS' : 'FAILED'}\\n\`;
						
						if (loginResult.success) {
							resultDiv.textContent += '3. Testing current user...\\n';
							const meResult = await testAPI('GET', '/api/auth/me', null, null, false);
							resultDiv.textContent += \`   Current User: \${meResult.success ? 'SUCCESS' : 'FAILED'}\\n\`;
						}
					}
					
					resultDiv.textContent += '\\nAll tests completed!';
					resultDiv.className = 'result success';
				});

				// Raw API Test
				document.getElementById('test-api-btn').addEventListener('click', async function() {
					const method = document.getElementById('api-method').value;
					const endpoint = document.getElementById('api-endpoint').value;
					const bodyText = document.getElementById('api-body').value;
					const resultDiv = document.getElementById('api-result');
					
					let data = null;
					if (method === 'POST' && bodyText.trim()) {
						try {
							data = JSON.parse(bodyText);
						} catch (e) {
							resultDiv.textContent = 'Invalid JSON in request body';
							resultDiv.className = 'result error';
							return;
						}
					}
					
					await testAPI(method, endpoint, data, resultDiv);
				});

				// Helper function to test API
				async function testAPI(method, endpoint, data, resultDiv, showResult = true) {
					const startTime = Date.now();
					
					try {
						const options = {
							method: method,
							headers: {
								'Content-Type': 'application/json'
							}
						};
						
						// Add auth token if available
						const token = localStorage.getItem('auth_token');
						if (token) {
							options.headers['Authorization'] = \`Bearer \${token}\`;
						}
						
						if (data && method !== 'GET') {
							options.body = JSON.stringify(data);
						}
						
						const response = await fetch(endpoint, options);
						const result = await response.json();
						const duration = Date.now() - startTime;
						
						// Store token if login was successful
						if (endpoint === '/api/auth/login' && result.success && result.token) {
							localStorage.setItem('auth_token', result.token);
						}
						
						if (showResult && resultDiv) {
							resultDiv.textContent = \`Status: \${response.status}\\nDuration: \${duration}ms\\n\\nResponse:\\n\${JSON.stringify(result, null, 2)}\`;
							resultDiv.className = response.ok ? 'result success' : 'result error';
						}
						
						return result;
					} catch (error) {
						const duration = Date.now() - startTime;
						const errorMsg = \`Error: \${error.message}\\nDuration: \${duration}ms\`;
						
						if (showResult && resultDiv) {
							resultDiv.textContent = errorMsg;
							resultDiv.className = 'result error';
						}
						
						return { success: false, message: error.message };
					}
				}
			});
		</script>
	`;
}
