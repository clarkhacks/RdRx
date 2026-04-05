/**
 * Authentication validation utilities
 * 
 * Provides functions for validating authentication-related data
 * such as emails, passwords, and tokens.
 * 
 * @module validation/auth
 */

import { ValidationError } from '../errors';
import { ERROR_MESSAGES, PASSWORD_MIN_LENGTH, REGEX_PATTERNS } from '../config/constants';
import { ValidationResult } from './url';

/**
 * Validates an email address
 * 
 * @param email - The email address to validate
 * @param throwOnError - If true, throws ValidationError instead of returning result
 * @returns Validation result object
 * 
 * @example
 * const result = validateEmail('user@example.com');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateEmail(email: string, throwOnError: boolean = false): ValidationResult {
	if (!REGEX_PATTERNS.EMAIL.test(email)) {
		const error = ERROR_MESSAGES.INVALID_EMAIL;
		if (throwOnError) {
			throw new ValidationError(error, 'email');
		}
		return { valid: false, error };
	}

	return { valid: true };
}

/**
 * Validates a password
 * 
 * Password must be at least PASSWORD_MIN_LENGTH characters long
 * 
 * @param password - The password to validate
 * @param throwOnError - If true, throws ValidationError instead of returning result
 * @returns Validation result object
 * 
 * @example
 * const result = validatePassword('mySecurePassword123');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validatePassword(password: string, throwOnError: boolean = false): ValidationResult {
	if (password.length < PASSWORD_MIN_LENGTH) {
		const error = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
		if (throwOnError) {
			throw new ValidationError(error, 'password');
		}
		return { valid: false, error };
	}

	return { valid: true };
}

/**
 * Validates an API key format
 * 
 * API keys must match the pattern: rdrx_live_[24 alphanumeric characters]
 * 
 * @param apiKey - The API key to validate
 * @param throwOnError - If true, throws ValidationError instead of returning result
 * @returns Validation result object
 * 
 * @example
 * const result = validateApiKey('rdrx_live_A7xK9mP2nQ8vR4wS6tY1zB3c');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateApiKey(apiKey: string, throwOnError: boolean = false): ValidationResult {
	if (!REGEX_PATTERNS.API_KEY.test(apiKey)) {
		const error = 'Invalid API key format';
		if (throwOnError) {
			throw new ValidationError(error, 'apiKey');
		}
		return { valid: false, error };
	}

	return { valid: true };
}
