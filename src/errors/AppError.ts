/**
 * Base application error class
 * 
 * All custom errors in the application should extend this class.
 * Provides consistent error handling with HTTP status codes.
 */
export class AppError extends Error {
	/**
	 * Create a new application error
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
		
		// Maintains proper stack trace for where error was thrown (V8 only)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	/**
	 * Convert error to JSON response format
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
