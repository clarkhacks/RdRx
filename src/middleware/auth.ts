import { Env } from '../types';
import { verifySession } from '../components/auth/service';

/**
 * Authentication middleware
 * This middleware checks if a request is authenticated and adds the user to the request context
 */
export async function authMiddleware(
	request: Request,
	env: Env
): Promise<{ request: Request; user: any | null; isAuthenticated: boolean }> {
	try {
		// Verify the session
		const { user, session } = await verifySession(env, request);

		// Create a new request object with the user and session attached
		const enhancedRequest = new Request(request.url, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			redirect: request.redirect,
			signal: request.signal,
		});

		// Attach user and session to the request object
		Object.defineProperties(enhancedRequest, {
			user: {
				value: user,
				writable: false,
			},
			session: {
				value: session,
				writable: false,
			},
		});

		return {
			request: enhancedRequest,
			user,
			isAuthenticated: user !== null,
		};
	} catch (error) {
		console.error('Auth middleware error:', error);
		return {
			request,
			user: null,
			isAuthenticated: false,
		};
	}
}

/**
 * Redirect to login if not authenticated
 */
export function redirectToLoginIfNotAuthenticated(isAuthenticated: boolean, redirectUrl?: string): Response | null {
	if (!isAuthenticated) {
		const loginUrl = redirectUrl ? `/login?redirect_url=${encodeURIComponent(redirectUrl)}` : '/login';

		return new Response(null, {
			status: 302,
			headers: {
				Location: loginUrl,
			},
		});
	}

	return null;
}

/**
 * Return unauthorized response if not authenticated
 */
export function unauthorizedResponseIfNotAuthenticated(isAuthenticated: boolean): Response | null {
	if (!isAuthenticated) {
		return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return null;
}
