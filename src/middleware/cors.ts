/**
 * CORS (Cross-Origin Resource Sharing) middleware
 * 
 * Provides centralized CORS configuration for the application.
 * Handles preflight requests and adds appropriate CORS headers.
 */

/**
 * CORS configuration options
 */
export interface CorsOptions {
	/**
	 * Allowed origins (use '*' for all origins)
	 */
	origin?: string | string[];
	
	/**
	 * Allowed HTTP methods
	 */
	methods?: string[];
	
	/**
	 * Allowed headers
	 */
	allowedHeaders?: string[];
	
	/**
	 * Exposed headers
	 */
	exposedHeaders?: string[];
	
	/**
	 * Allow credentials (cookies, authorization headers)
	 */
	credentials?: boolean;
	
	/**
	 * Max age for preflight cache (in seconds)
	 */
	maxAge?: number;
}

/**
 * Default CORS configuration
 */
const DEFAULT_CORS_OPTIONS: CorsOptions = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	exposedHeaders: ['Content-Length', 'Content-Type'],
	credentials: true,
	maxAge: 86400, // 24 hours
};

/**
 * Get CORS headers based on configuration
 * 
 * @param options - CORS configuration options
 * @param requestOrigin - Origin from the request headers
 * @returns Headers object with CORS headers
 */
export function getCorsHeaders(
	options: CorsOptions = {},
	requestOrigin?: string
): Headers {
	const config = { ...DEFAULT_CORS_OPTIONS, ...options };
	const headers = new Headers();

	// Handle origin
	if (config.origin === '*') {
		headers.set('Access-Control-Allow-Origin', '*');
	} else if (Array.isArray(config.origin)) {
		// Check if request origin is in allowed list
		if (requestOrigin && config.origin.includes(requestOrigin)) {
			headers.set('Access-Control-Allow-Origin', requestOrigin);
		}
	} else if (config.origin) {
		headers.set('Access-Control-Allow-Origin', config.origin);
	}

	// Handle methods
	if (config.methods) {
		headers.set('Access-Control-Allow-Methods', config.methods.join(', '));
	}

	// Handle allowed headers
	if (config.allowedHeaders) {
		headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
	}

	// Handle exposed headers
	if (config.exposedHeaders) {
		headers.set('Access-Control-Expose-Headers', config.exposedHeaders.join(', '));
	}

	// Handle credentials
	if (config.credentials) {
		headers.set('Access-Control-Allow-Credentials', 'true');
	}

	// Handle max age
	if (config.maxAge) {
		headers.set('Access-Control-Max-Age', config.maxAge.toString());
	}

	return headers;
}

/**
 * Handle CORS preflight request
 * 
 * @param request - The incoming request
 * @param options - CORS configuration options
 * @returns Response for preflight request or null if not a preflight
 */
export function handleCorsPrefligh(
	request: Request,
	options: CorsOptions = {}
): Response | null {
	// Check if this is a preflight request
	if (request.method !== 'OPTIONS') {
		return null;
	}

	const requestOrigin = request.headers.get('Origin');
	const corsHeaders = getCorsHeaders(options, requestOrigin || undefined);

	return new Response(null, {
		status: 204,
		headers: corsHeaders,
	});
}

/**
 * Add CORS headers to an existing response
 * 
 * @param response - The response to add headers to
 * @param request - The original request
 * @param options - CORS configuration options
 * @returns New response with CORS headers
 */
export function addCorsHeaders(
	response: Response,
	request: Request,
	options: CorsOptions = {}
): Response {
	const requestOrigin = request.headers.get('Origin');
	const corsHeaders = getCorsHeaders(options, requestOrigin || undefined);

	// Create new response with existing body and headers
	const newResponse = new Response(response.body, response);

	// Add CORS headers
	corsHeaders.forEach((value, key) => {
		newResponse.headers.set(key, value);
	});

	return newResponse;
}

/**
 * CORS middleware wrapper
 * 
 * Wraps a request handler and automatically handles CORS.
 * 
 * @param handler - The request handler function
 * @param options - CORS configuration options
 * @returns Wrapped handler with CORS support
 * 
 * @example
 * const handler = corsMiddleware(async (request, env) => {
 *   return new Response('Hello');
 * });
 */
export function corsMiddleware<T extends any[]>(
	handler: (request: Request, ...args: T) => Promise<Response>,
	options: CorsOptions = {}
): (request: Request, ...args: T) => Promise<Response> {
	return async (request: Request, ...args: T): Promise<Response> => {
		// Handle preflight
		const preflightResponse = handleCorsPrefligh(request, options);
		if (preflightResponse) {
			return preflightResponse;
		}

		// Execute handler
		const response = await handler(request, ...args);

		// Add CORS headers to response
		return addCorsHeaders(response, request, options);
	};
}
