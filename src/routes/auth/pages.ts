import { Env } from '../../types';
import { SignupFormUI } from '../../components/auth/SignupForm';
import { LoginFormUI } from '../../components/auth/LoginForm';
import { ResetPasswordFormUI, ResetPasswordConfirmUI } from '../../components/auth/ResetPasswordForm';
import { TestAuthUI } from '../../components/auth/TestAuthUI';
import { renderDocumentHead } from '../../components/layouts/DocumentHead';

/**
 * Handle signup page
 */
export async function handleSignupPage(request: Request, env: Env): Promise<Response> {
	// Check if signups are disabled
	if (env.DISABLE_SIGNUPS === 'true') {
		return new Response('Not Found', {
			status: 404,
			headers: { 'Content-Type': 'text/plain' },
		});
	}

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
export async function handleLoginPage(request: Request, env: Env): Promise<Response> {
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
export async function handleForgotPasswordPage(request: Request, env: Env): Promise<Response> {
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
export async function handleResetPasswordPage(request: Request, env: Env): Promise<Response> {
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
 * Handle test auth page
 */
export async function handleTestAuthPage(request: Request, env: Env): Promise<Response> {
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
