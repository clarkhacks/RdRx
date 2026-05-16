import { Env } from '../../types';
import { handleAuthAPI } from './api';
import {
	handleSignupPage,
	handleLoginPage,
	handleForgotPasswordPage,
	handleResetPasswordPage,
	handleTestAuthPage,
} from './pages';

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
