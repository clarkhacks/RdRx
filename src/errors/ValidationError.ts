/**
 * Validation error class
 * 
 * Thrown when user input fails validation checks.
 * Always returns HTTP 400 (Bad Request).
 * 
 * @module errors/ValidationError
 */

import { AppError } from './AppError';

/**
 * Error thrown when validation fails
 * 
 * @example
 * throw new ValidationError('Invalid email format', 'email');
 */
export class ValidationError extends AppError {
	/**
	 * Creates a new ValidationError
	 * 
	 * @param message - Human-readable validation error message
	 * @param field - Optional field name that failed validation
	 */
	constructor(message: string, public field?: string) {
		super(message, 400, 'VALIDATION_ERROR');
		this.name = 'ValidationError';
	}

	/**
	 * Converts error to JSON format with field information
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
