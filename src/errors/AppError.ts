/**
 * Base application error class
 * 
 * All custom errors in the application should extend this class.
 * Provides consistent error handling with HTTP status codes and error codes.
 * 
 * @module errors/AppError
 */

/**
 * Base error class for application-specific errors
 * 
 * @example
 * throw new AppError('Something went wrong', 500, 'INTERNAL_ERROR');
 */
export class AppError extends Error {
	/**
	 * Creates a new AppError
	 * 
	 * @param message - Human-readable error message
	 * @param statusCode - HTTP status code (default: 500)
	 * @param code - Machine-readable error code for client handling
	 */
	constructor(
		public message: string,
		public statusCode: number = 500,
		public code?: string
	) {
		super(message);
		this.name = 'AppError';
		
		// Maintains proper stack trace for where error was thrown
		Object.setPrototypeOf(this, new.target.prototype);
	}

	/**
	 * Converts error to JSON format for API responses
	 */
	toJSON() {
		return {
			success: false,
			error: this.message,
			code: this.code,
			statusCode: this.statusCode,
		};
	}
}
