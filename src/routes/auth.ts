import { Env } from '../types';

/**
 * Handle authentication routes
 * - /login - Render login page
 * - /verify - Handle authentication verification
 * 
 * @deprecated This file is deprecated. Authentication routes are now handled by customAuth.ts
 * This file can be safely removed.
 */
export async function handleAuthRoutes(request: Request, env: Env, path: string): Promise<Response> {
	// Redirect to customAuth routes
	return new Response('Not Found - Use /auth routes instead', { status: 404 });
}
