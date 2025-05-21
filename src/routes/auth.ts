import { Env } from '../types';
import { renderLoginPage } from '../components/loginForm';
import { renderVerify } from '../components/verify';

/**
 * Handle authentication routes
 * - /login - Render login page
 * - /verify - Handle authentication verification
 */
export async function handleAuthRoutes(request: Request, env: Env, path: string): Promise<Response> {
	// Handle login page
	if (path === '/login') {
		return renderLoginPage(env);
	}

	// Handle verification
	if (path === '/verify') {
		return renderVerify();
	}

	// Fallback for unknown auth routes
	return new Response('Not Found', { status: 404 });
}
