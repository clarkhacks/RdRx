/**
 * Not Found error class
 * 
 * Thrown when a requested resource cannot be found.
 * Always returns HTTP 404 (Not Found).
 * 
 * @module errors/NotFoundError
 */

import { AppError } from './AppError';

/**
 * Error thrown when a resource is not found
 * 
 * @example
 * throw new NotFoundError('Shortcode not found');
 * throw new NotFoundError('User', 'user123'); // "User user123 not found"
 */
export class NotFoundError extends AppError {
	/**
	 * Creates a new NotFoundError
	 * 
	 * @param resource - Type of resource that wasn't found (e.g., 'User', 'Shortcode')
	 * @param identifier - Optional identifier of the resource
	 */
	constructor(resource: string, identifier?: string) {
		const message = identifier 
			? `${resource} ${identifier} not found`
			: `${resource} not found`;
		super(message, 404, 'NOT_FOUND');
		this.name = 'NotFoundError';
	}
}
