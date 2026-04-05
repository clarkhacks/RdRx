/**
 * Centralized error handling middleware
 * 
 * This middleware provides consistent error handling across the application.
 * It converts errors to appropriate HTTP responses with proper status codes
 * and error messages.
 * 
 * @module middleware/errorHandler
 */

import { AppError } from '../errors';
import { HTTP_STATUS, CONTENT_TYPES, ERROR_MESSAGES } from '../config/constants';
import { addCorsHeaders } from './cors';

/**
 * Handles errors and converts them to HTTP responses
 * 
 * @param error - The error to handle
 * @returns HTTP response with appropriate status code and error message
 * 
 * @example
 * try {
 *   // Your code here
 * } catch (error) {
 *   return handleError(error);
 * }
 */
export function handleError(error: unknown): Response {
	console.error('Error occurred:', error);

	// Handle known AppError instances
	if (error instanceof AppError) {
		const response = new Response(
			JSON.stringify(error.toJSON()),
			{
				status: error.statusCode,
				headers: { 'Content-Type': CONTENT_TYPES.JSON },
			}
		);
		return addCorsHeaders(response);
	}

	// Handle unknown errors
	const response = new Response(
		JSON.stringify({
			success: false,
			error: ERROR_MESSAGES.INTERNAL_ERROR,
			code: 'INTERNAL_ERROR',
		}),
		{
			status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
			headers: { 'Content-Type': CONTENT_TYPES.JSON },
		}
	);
	return addCorsHeaders(response);
}

/**
 * Wraps an async handler function with error handling
 * 
 * @param handler - The async handler function to wrap
 * @returns Wrapped handler that catches and handles errors
 * 
 * @example
 * export const myRoute = withErrorHandling(async (request, env) => {
 *   // Your route logic here
 *   // Errors will be automatically caught and handled
 *   return new Response('OK');
 * });
 */
export function withErrorHandling<T extends any[], R>(
	handler: (...args: T) => Promise<R>
): (...args: T) => Promise<R | Response> {
	return async (...args: T): Promise<R | Response> => {
		try {
			return await handler(...args);
		} catch (error) {
			return handleError(error) as R | Response;
		}
	};
}
