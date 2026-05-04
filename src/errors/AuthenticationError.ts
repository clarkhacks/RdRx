import { AppError } from './AppError';

/**
 * Authentication error for unauthorized access
 * 
 * Used when a user is not authenticated or their session is invalid.
 * Returns HTTP 401 Unauthorized.
 */
export class AuthenticationError extends AppError {
	/**
	 * Create a new authentication error
	 * 
	 * @param message - Description of the authentication failure
	 */
	constructor(message: string = 'Authentication required') {
		super(message, 401, 'AUTH_ERROR');
		this.name = 'AuthenticationError';
	}
}
