/**
 * CORS middleware for handling Cross-Origin Resource Sharing
 * 
 * This middleware provides centralized CORS configuration for all API endpoints.
 * It handles preflight OPTIONS requests and adds appropriate CORS headers to responses.
 * 
 * @module middleware/cors
 */

import { CORS_HEADERS } from '../config/constants';

/**
 * Adds CORS headers to a response
 * 
 * @param response - The response to add CORS headers to
 * @returns New response with CORS headers added
 * 
 * @example
 * const response = new Response('OK');
 * return addCorsHeaders(response);
 */
export function addCorsHeaders(response: Response): Response {
	const headers = new Headers(response.headers);
	
	// Add all CORS headers
	Object.entries(CORS_HEADERS).forEach(([key, value]) => {
		headers.set(key, value);
	});

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

/**
 * Handles CORS preflight OPTIONS requests
 * 
 * @returns Response with CORS headers for preflight requests
 * 
 * @example
 * if (request.method === 'OPTIONS') {
 *   return handleCorsPreflightRequest();
 * }
 */
export function handleCorsPreflightRequest(): Response {
	return new Response(null, {
		status: 204,
		headers: CORS_HEADERS,
	});
}

/**
 * CORS middleware that handles both preflight and regular requests
 * 
 * @param request - The incoming request
 * @param handler - The request handler function
 * @returns Response with CORS headers
 * 
 * @example
 * export async function fetch(request: Request, env: Env) {
 *   return corsMiddleware(request, async (req) => {
 *     // Your handler logic here
 *     return new Response('OK');
 *   });
 * }
 */
export async function corsMiddleware(
	request: Request,
	handler: (request: Request) => Promise<Response>
): Promise<Response> {
	// Handle preflight requests
	if (request.method === 'OPTIONS') {
		return handleCorsPreflightRequest();
	}

	// Handle regular requests and add CORS headers to response
	const response = await handler(request);
	return addCorsHeaders(response);
}
