import { AppError } from './AppError';

/**
 * Conflict error for duplicate resources
 *
 * Used when attempting to create a resource that already exists.
 * Returns HTTP 409 Conflict.
 */
export class ConflictError extends AppError {
	/**
	 * Create a new conflict error
	 *
	 * @param message - Description of the conflict
	 * @param resource - Optional resource type that conflicts
	 */
	constructor(
		message: string = 'Resource already exists',
		public resource?: string,
	) {
		super(message, 409, 'CONFLICT');
		this.name = 'ConflictError';
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
