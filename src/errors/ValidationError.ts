import { AppError } from './AppError';

/**
 * Validation error for invalid input data
 *
 * Used when user input fails validation checks.
 * Returns HTTP 400 Bad Request.
 */
export class ValidationError extends AppError {
	/**
	 * Create a new validation error
	 *
	 * @param message - Description of the validation failure
	 * @param field - Optional field name that failed validation
	 */
	constructor(
		message: string,
		public field?: string,
	) {
		super(message, 400, 'VALIDATION_ERROR');
		this.name = 'ValidationError';
	}

	/**
	 * Convert error to JSON response format
	 */
	toJSON() {
		return {
			success: false,
			error: this.message,
			code: this.code,
			field: this.field,
			statusCode: this.statusCode,
		};
	}
}
