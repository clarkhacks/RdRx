import { AppError } from './AppError';

/**
 * Not found error for missing resources
 *
 * Used when a requested resource does not exist.
 * Returns HTTP 404 Not Found.
 */
export class NotFoundError extends AppError {
	/**
	 * Create a new not found error
	 *
	 * @param message - Description of what was not found
	 * @param resource - Optional resource type (e.g., 'User', 'Shortcode')
	 */
	constructor(
		message: string = 'Resource not found',
		public resource?: string,
	) {
		super(message, 404, 'NOT_FOUND');
		this.name = 'NotFoundError';
	}

	/**
	 * Convert error to JSON response format
	 */
	toJSON() {
		return {
			success: false,
			error: this.message,
			code: this.code,
			resource: this.resource,
			statusCode: this.statusCode,
		};
	}
}
