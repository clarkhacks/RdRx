import { createClerkClient } from '@clerk/backend';
import { Env } from '../types';

/**
 * Initialize Clerk client with environment variables
 */
export function initClerkClient(env: Env) {
	return createClerkClient({
		secretKey: env.CLERK_API_KEY,
		publishableKey: env.CLERK_PUBLISHABLE_KEY,
	});
}

/**
 * Authorized parties for Clerk authentication
 */
const AUTHORIZED_PARTIES = ['http://localhost:8787', 'https://rdrx.co'];

/**
 * Check if a request is authenticated
 */
export async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
	try {
		const clerkClient = initClerkClient(env);

		const { isSignedIn } = await clerkClient.authenticateRequest(request, {
			jwtKey: env.CLERK_JWT_KEY,
			authorizedParties: AUTHORIZED_PARTIES,
		});

		if (!isSignedIn) {
			console.error('User is not signed in.');
			return false;
		}

		console.log('User is authenticated.');
		return true;
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
		const clerkClient = initClerkClient(env);

		const authResult = await clerkClient.authenticateRequest(request, {
			jwtKey: env.CLERK_JWT_KEY,
			authorizedParties: AUTHORIZED_PARTIES,
		});

		if (!authResult.isSignedIn) {
			console.error('User is not signed in.');
			return null;
		}

		// Try different possible paths to get the user ID
		// Using type assertion with unknown first for safety
		const authData = authResult as unknown;

		// Now we can safely check properties
		if (typeof authData === 'object' && authData !== null) {
			const auth = authData as Record<string, unknown>;

			// Option 1: Direct userId property
			if (typeof auth.userId === 'string') {
				return auth.userId;
			}

			// Option 2: Through session
			if (
				typeof auth.session === 'object' &&
				auth.session !== null &&
				typeof (auth.session as Record<string, unknown>).userId === 'string'
			) {
				return (auth.session as Record<string, unknown>).userId as string;
			}

			// Option 3: Through toAuth function
			if (typeof auth.toAuth === 'function') {
				const authObject = auth.toAuth() as Record<string, unknown> | null;

				if (authObject) {
					if (typeof authObject.userId === 'string') {
						return authObject.userId;
					}

					if (
						typeof authObject.user === 'object' &&
						authObject.user !== null &&
						typeof (authObject.user as Record<string, unknown>).id === 'string'
					) {
						return (authObject.user as Record<string, unknown>).id as string;
					}
				}
			}
		}

		console.error('Could not extract user ID from auth result.');
		return null;
	} catch (error) {
		console.error('Failed to get user ID:', error instanceof Error ? error.message : String(error));
		return null;
	}
}
