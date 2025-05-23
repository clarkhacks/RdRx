import { Env } from '../types';
import { verifySession } from '../components/auth/service';

/**
 * Authorized parties for authentication
 */
const AUTHORIZED_PARTIES = ['http://localhost:8787', 'https://rdrx.co'];

/**
 * Check if a request is authenticated
 */
export async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
	try {
		const { user } = await verifySession(env, request);
		return user !== null;
	} catch (error) {
		console.error('Authentication failed:', error instanceof Error ? error.message : String(error));
		return false;
	}
}

/**
 * Get the user ID from an authenticated request
 */
export async function getUserID(request: Request, env: Env): Promise<string | null> {
	try {
		const { user } = await verifySession(env, request);

		if (!user) {
			console.error('User is not signed in.');
			return null;
		}

		return user.uid;
	} catch (error) {
		console.error('Failed to get user ID:', error instanceof Error ? error.message : String(error));
		return null;
	}
}

/**
 * Get the current user from an authenticated request
 */
export async function getCurrentUser(request: Request, env: Env) {
	return verifySession(env, request);
}
