import { Env } from '../types';
import {
	signupUser,
	loginUser,
	requestPasswordReset,
	confirmPasswordReset,
	verifySession,
	uploadProfilePicture,
} from '../components/auth/service';
import { hashPassword, verifyPassword, isValidPassword } from '../components/auth/utils';
import { SignupRequest, LoginRequest, ResetPasswordRequest, ResetPasswordConfirmRequest } from '../components/auth/types';
import { SignupFormUI } from '../components/auth/SignupForm';
import { LoginFormUI } from '../components/auth/LoginForm';
import { ResetPasswordFormUI, ResetPasswordConfirmUI } from '../components/auth/ResetPasswordForm';
import { TestAuthUI } from '../components/auth/TestAuthUI';
import { renderDocumentHead } from '../components/layouts/DocumentHead';

/**
 * Handle custom authentication routesppe
 */
export async function handleCustomAuthRoutes(request: Request, env: Env): Promise<Response | null> {
	const url = new URL(request.url);
	const path = url.pathname;
	const method = request.method;

	// API Routes
	if (path.startsWith('/api/auth/')) {
		return handleAuthAPI(request, env, path, method);
	}

	// Page Routes
	switch (path) {
		case '/signup':
			return handleSignupPage(request, env);
		case '/login':
			return handleLoginPage(request, env);
		case '/forgot-password':
			return handleForgotPasswordPage(request, env);
		case '/reset-password':
			return handleResetPasswordPage(request, env);
		case '/test-auth':
			return handleTestAuthPage(request, env);
		default:
			return null;
	}
}

/**
 * Handle authentication API endpoints
 */
async function handleAuthAPI(request: Request, env: Env, path: string, method: string): Promise<Response> {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	};

	// Handle CORS preflight
	if (method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders });
	}

	try {
		switch (path) {
			case '/api/auth/signup':
				if (method !== 'POST') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleSignupAPI(request, env, corsHeaders);

			case '/api/auth/login':
				if (method !== 'POST') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleLoginAPI(request, env, corsHeaders);

			case '/api/auth/reset-password':
				if (method !== 'POST') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleResetPasswordAPI(request, env, corsHeaders);

			case '/api/auth/reset-password/confirm':
				if (method !== 'POST') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleResetPasswordConfirmAPI(request, env, corsHeaders);

			case '/api/auth/profile/picture':
				if (method !== 'POST') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleProfilePictureUploadAPI(request, env, corsHeaders);

			case '/api/auth/me':
				if (method !== 'GET') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleMeAPI(request, env, corsHeaders);

			case '/api/auth/profile':
				if (method !== 'POST') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleUpdateProfileAPI(request, env, corsHeaders);

			case '/api/auth/password':
				if (method !== 'POST') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleChangePasswordAPI(request, env, corsHeaders);

			case '/api/auth/logout':
				if (method !== 'POST') {
					return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
						status: 405,
						headers: { 'Content-Type': 'application/json', ...corsHeaders },
					});
				}
				return await handleLogoutAPI(corsHeaders);

			default:
				return new Response(JSON.stringify({ success: false, message: 'Not found' }), {
					status: 404,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
		}
	} catch (error) {
		console.error('Auth API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}
}

/**
 * Handle signup API
 */
async function handleSignupAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const body = (await request.json()) as SignupRequest;
		const result = await signupUser(env, body);

		// If signup was successful and we have a token, set a secure HTTP-only cookie
		if (result.success && result.token) {
			// Set cookie expiration (default to 24 hours for new signups)
			const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

			// Get the request URL to determine the domain
			const url = new URL(request.url);
			const domain = url.hostname;

			// Create secure cookie with the token
			// Use SameSite=Lax to allow the cookie to be sent with top-level navigations
			const cookieHeader = `auth_token=${
				result.token
			}; Expires=${expires.toUTCString()}; Path=/; Domain=${domain}; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`;

			// Return response with the cookie set
			return new Response(JSON.stringify(result), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Set-Cookie': cookieHeader,
					...corsHeaders,
				},
			});
		}

		// For failed signup attempts, just return the result
		return new Response(JSON.stringify(result), {
			status: result.success ? 200 : 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	} catch (error) {
		console.error('Signup API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}
}

/**
 * Handle login API
 */
async function handleLoginAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const body = (await request.json()) as LoginRequest;
		const result = await loginUser(env, body);

		// If login was successful and we have a token, set a secure HTTP-only cookie
		if (result.success && result.token) {
			// Get remember-me preference from request body
			const rememberMe = body.remember || false;

			// Set cookie expiration based on remember-me preference
			const expires = rememberMe
				? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
				: new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

			// Get the request URL to determine the domain
			const url = new URL(request.url);
			const domain = url.hostname;

			// Create secure cookie with the token
			// Use SameSite=Lax to allow the cookie to be sent with top-level navigations
			const cookieHeader = `auth_token=${
				result.token
			}; Expires=${expires.toUTCString()}; Path=/; Domain=${domain}; HttpOnly; Secure; SameSite=Lax; Max-Age=${
				rememberMe ? 2592000 : 86400
			}`;

			// Return response with the cookie set
			return new Response(JSON.stringify(result), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Set-Cookie': cookieHeader,
					...corsHeaders,
				},
			});
		}

		// For failed login attempts, just return the result
		return new Response(JSON.stringify(result), {
			status: result.success ? 200 : 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	} catch (error) {
		console.error('Login API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}
}

/**
 * Handle reset password API
 */
async function handleResetPasswordAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const body = (await request.json()) as ResetPasswordRequest;
		const result = await requestPasswordReset(env, body);

		return new Response(JSON.stringify(result), {
			status: result.success ? 200 : 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	} catch (error) {
		console.error('Reset password API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}
}

/**
 * Handle reset password confirm API
 */
async function handleResetPasswordConfirmAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const body = (await request.json()) as ResetPasswordConfirmRequest;
		const result = await confirmPasswordReset(env, body);

		return new Response(JSON.stringify(result), {
			status: result.success ? 200 : 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	} catch (error) {
		console.error('Reset password confirm API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}
}

/**
 * Handle profile picture upload API
 */
async function handleProfilePictureUploadAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		console.log('Profile picture upload API called');

		// Verify session
		const { user } = await verifySession(env, request);
		if (!user) {
			console.log('Profile picture upload: Unauthorized - no user found');
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		console.log('Profile picture upload: User authenticated:', user.uid);

		try {
			const formData = await request.formData();
			console.log('Form data parsed successfully');

			const file = formData.get('file') as File;
			if (!file) {
				console.log('Profile picture upload: No file provided in form data');
				return new Response(JSON.stringify({ success: false, message: 'No file provided' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}

			console.log('Profile picture upload: File received:', file.name, file.type, file.size);

			// Check if R2 bucket is available
			if (!env.R2_RDRX) {
				console.error('Profile picture upload: R2_RDRX bucket not available');
				return new Response(JSON.stringify({ success: false, message: 'Storage service unavailable' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}

			const result = await uploadProfilePicture(env, user.uid, file);
			console.log('Profile picture upload result:', result);

			return new Response(JSON.stringify(result), {
				status: result.success ? 200 : 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		} catch (formError) {
			console.error('Profile picture upload: Error parsing form data:', formError);
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Error processing form data: ' + (formError instanceof Error ? formError.message : String(formError)),
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				},
			);
		}
	} catch (error) {
		console.error('Profile picture upload API error:', error);
		return new Response(
			JSON.stringify({ success: false, message: 'Server error: ' + (error instanceof Error ? error.message : String(error)) }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			},
		);
	}
}

/**
 * Handle me API (get current user)
 */
async function handleMeAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		const { user } = await verifySession(env, request);

		if (!user) {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		return new Response(
			JSON.stringify({
				success: true,
				user: {
					uid: user.uid,
					name: user.name,
					email: user.email,
					profile_picture_url: user.profile_picture_url,
					created_at: user.created_at,
					updated_at: user.updated_at,
					email_verified: user.email_verified,
				},
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			},
		);
	} catch (error) {
		console.error('Me API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}
}

/**
 * Handle signup page
 */
async function handleSignupPage(request: Request, env: Env): Promise<Response> {
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'Sign Up - RDRX' })}
		<body>
			${SignupFormUI()}
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Handle login page
 */
async function handleLoginPage(request: Request, env: Env): Promise<Response> {
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'Sign In - RDRX' })}
		<body>
			${LoginFormUI()}
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Handle forgot password page
 */
async function handleForgotPasswordPage(request: Request, env: Env): Promise<Response> {
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'Reset Password - RDRX' })}
		<body>
			${ResetPasswordFormUI()}
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Handle reset password page
 */
async function handleResetPasswordPage(request: Request, env: Env): Promise<Response> {
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'Set New Password - RDRX' })}
		<body>
			${ResetPasswordConfirmUI()}
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

/**
 * Handle logout API
 */
async function handleLogoutAPI(corsHeaders: Record<string, string>): Promise<Response> {
	// Clear the auth cookie by setting an expired cookie with the same attributes as when setting it
	const cookieHeader = 'auth_token=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';

	return new Response(JSON.stringify({ success: true, message: 'Logged out successfully' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': cookieHeader,
			...corsHeaders,
		},
	});
}

/**
 * Handle update profile API
 */
async function handleUpdateProfileAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		// Verify session
		const { user } = await verifySession(env, request);
		if (!user) {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Get request body
		const body = (await request.json()) as { name: string; email: string };
		if (!body || typeof body !== 'object') {
			return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Extract profile data
		const { name, email } = body;

		// Validate inputs
		if (!name || !email) {
			return new Response(JSON.stringify({ success: false, message: 'Name and email are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Update user in database
		try {
			// Update user in database
			const stmt = env.DB.prepare(`
				UPDATE users 
				SET name = ?, email = ?, updated_at = ? 
				WHERE uid = ?
			`);

			await stmt.bind(name, email, Date.now(), user.uid).run();

			// Return success response
			return new Response(
				JSON.stringify({
					success: true,
					message: 'Profile updated successfully',
					user: {
						...user,
						name,
						email,
						updated_at: Date.now(),
					},
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				},
			);
		} catch (error) {
			console.error('Error updating user profile:', error);
			return new Response(JSON.stringify({ success: false, message: 'Failed to update profile' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}
	} catch (error) {
		console.error('Update profile API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}
}

/**
 * Handle change password API
 */
async function handleChangePasswordAPI(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
	try {
		// Verify session
		const { user } = await verifySession(env, request);
		if (!user) {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Get request body
		const body = (await request.json()) as { current_password: string; new_password: string; confirm_password: string };
		if (!body || typeof body !== 'object') {
			return new Response(JSON.stringify({ success: false, message: 'Invalid request body' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Extract password data
		const { current_password, new_password, confirm_password } = body;

		// Validate inputs
		if (!current_password || !new_password || !confirm_password) {
			return new Response(JSON.stringify({ success: false, message: 'All password fields are required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		if (new_password !== confirm_password) {
			return new Response(JSON.stringify({ success: false, message: 'New passwords do not match' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Validate password strength
		const passwordValidation = isValidPassword(new_password);
		if (!passwordValidation.valid) {
			return new Response(JSON.stringify({ success: false, message: passwordValidation.message || 'Invalid password' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Verify current password
		const isCurrentPasswordValid = await verifyPassword(current_password, user.password_hash);
		if (!isCurrentPasswordValid) {
			return new Response(JSON.stringify({ success: false, message: 'Current password is incorrect' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		// Hash new password
		const newPasswordHash = await hashPassword(new_password);

		// Update password in database
		try {
			const stmt = env.DB.prepare(`
				UPDATE users 
				SET password_hash = ?, updated_at = ? 
				WHERE uid = ?
			`);

			await stmt.bind(newPasswordHash, Date.now(), user.uid).run();

			// Return success response
			return new Response(
				JSON.stringify({
					success: true,
					message: 'Password updated successfully',
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				},
			);
		} catch (error) {
			console.error('Error updating user password:', error);
			return new Response(JSON.stringify({ success: false, message: 'Failed to update password' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}
	} catch (error) {
		console.error('Change password API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	}
}

/**
 * Handle test auth page
 */
async function handleTestAuthPage(request: Request, env: Env): Promise<Response> {
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		${renderDocumentHead({ title: 'Auth Test Suite - RDRX' })}
		<body>
			${TestAuthUI()}
		</body>
		</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}
