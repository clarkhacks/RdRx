import { Env } from '../types';
import {
	signupUser,
	loginUser,
	requestPasswordReset,
	confirmPasswordReset,
	verifySession,
	uploadProfilePicture,
} from '../components/auth/service';
import { SignupRequest, LoginRequest, ResetPasswordRequest, ResetPasswordConfirmRequest } from '../components/auth/types';
import { SignupFormUI } from '../components/auth/SignupForm';
import { LoginFormUI } from '../components/auth/LoginForm';
import { ResetPasswordFormUI, ResetPasswordConfirmUI } from '../components/auth/ResetPasswordForm';
import { TestAuthUI } from '../components/auth/TestAuthUI';
import { renderDocumentHead } from '../components/layouts/DocumentHead';

/**
 * Handle custom authentication routes
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

			// Create secure cookie with the token
			const cookieHeader = `auth_token=${result.token}; Expires=${expires.toUTCString()}; Path=/; HttpOnly; Secure; SameSite=Strict`;

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
		// Verify session
		const { user } = await verifySession(env, request);
		if (!user) {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return new Response(JSON.stringify({ success: false, message: 'No file provided' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}

		const result = await uploadProfilePicture(env, user.uid, file);

		return new Response(JSON.stringify(result), {
			status: result.success ? 200 : 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	} catch (error) {
		console.error('Profile picture upload API error:', error);
		return new Response(JSON.stringify({ success: false, message: 'Invalid request' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
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
			}
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
	// Clear the auth cookie by setting an expired cookie
	const cookieHeader = 'auth_token=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/; HttpOnly; Secure; SameSite=Strict';

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
