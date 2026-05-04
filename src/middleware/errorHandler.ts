import { AppError } from '../errors';

/**
 * Centralized error handler middleware
 * 
 * Converts errors into consistent HTTP responses with appropriate
 * status codes and error messages.
 * 
 * @param error - The error to handle (can be any type)
 * @returns HTTP Response with error details
 * 
 * @example
 * try {
 *   // ... some operation
 * } catch (error) {
 *   return handleError(error);
 * }
 */
export function handleError(error: unknown): Response {
	console.error('Error occurred:', error);

	// Handle known AppError instances
	if (error instanceof AppError) {
		return new Response(
			JSON.stringify(error.toJSON()),
			{
				status: error.statusCode,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	// Handle standard Error instances
	if (error instanceof Error) {
		return new Response(
			JSON.stringify({
				success: false,
				error: error.message || 'Internal server error',
				code: 'INTERNAL_ERROR',
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	// Handle unknown error types
	return new Response(
		JSON.stringify({
			success: false,
			error: 'An unexpected error occurred',
			code: 'UNKNOWN_ERROR',
		}),
		{
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		}
	);
}

/**
 * Async error handler wrapper
 * 
 * Wraps an async function and automatically handles any errors
 * that occur during execution.
 * 
 * @param fn - Async function to wrap
 * @returns Wrapped function that handles errors
 * 
 * @example
 * const handler = asyncErrorHandler(async (request, env) => {
 *   // ... your code
 *   return new Response('Success');
 * });
 */
export function asyncErrorHandler<T extends any[], R>(
	fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R | Response> {
	return async (...args: T): Promise<R | Response> => {
		try {
			return await fn(...args);
		} catch (error) {
			return handleError(error);
		}
	};
}
