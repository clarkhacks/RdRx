/**
 * Authentication error class
 * 
 * Thrown when authentication is required but not provided,
 * or when authentication credentials are invalid.
 * Always returns HTTP 401 (Unauthorized).
 * 
 * @module errors/AuthenticationError
 */

import { AppError } from './AppError';

/**
 * Error thrown when authentication fails or is required
 * 
 * @example
 * throw new AuthenticationError('Invalid credentials');
 * throw new AuthenticationError(); // Uses default message
 */
export class AuthenticationError extends AppError {
	/**
	 * Creates a new AuthenticationError
	 * 
	 * @param message - Human-readable error message (default: 'Authentication required')
	 */
	constructor(message: string = 'Authentication required') {
		super(message, 401, 'AUTH_ERROR');
		this.name = 'AuthenticationError';
	}
}
