/**
 * Conflict error class
 * 
 * Thrown when a resource already exists or there's a conflict
 * with the current state of the resource.
 * Always returns HTTP 409 (Conflict).
 * 
 * @module errors/ConflictError
 */

import { AppError } from './AppError';

/**
 * Error thrown when there's a resource conflict
 * 
 * @example
 * throw new ConflictError('Shortcode already exists');
 * throw new ConflictError('Email already registered');
 */
export class ConflictError extends AppError {
	/**
	 * Creates a new ConflictError
	 * 
	 * @param message - Human-readable conflict error message
	 */
	constructor(message: string) {
		super(message, 409, 'CONFLICT');
		this.name = 'ConflictError';
	}
}
