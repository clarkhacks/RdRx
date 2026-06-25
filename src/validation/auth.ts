import { ValidationError } from '../errors';
import { ERROR_MESSAGES, EMAIL_REGEX, PASSWORD_MIN_LENGTH } from '../config/constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Validate an email address
 *
 * @param email - The email to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * const result = validateEmail('user@example.com');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateEmail(email: string): ValidationResult {
	if (!email || typeof email !== 'string') {
		return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
	}

	// Check format
	if (!EMAIL_REGEX.test(email)) {
		return { valid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
	}

	return { valid: true };
}

/**
 * Check if an email is valid (boolean version)
 *
 * @param email - The email to check
 * @returns True if valid, false otherwise
 *
 * @example
 * if (isValidEmail('user@example.com')) {
 *   // Email is valid
 * }
 */
export function isValidEmail(email: string): boolean {
	return validateEmail(email).valid;
}

/**
 * Validate email and throw error if invalid
 *
 * @param email - The email to validate
 * @throws {ValidationError} If email is invalid
 *
 * @example
 * try {
 *   assertValidEmail(userInput);
 * } catch (error) {
 *   // Handle validation error
 * }
 */
export function assertValidEmail(email: string): void {
	const result = validateEmail(email);
	if (!result.valid) {
		throw new ValidationError(result.error || ERROR_MESSAGES.INVALID_EMAIL, 'email');
	}
}

/**
 * Validate a password
 *
 * @param password - The password to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * const result = validatePassword('mypassword123');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validatePassword(password: string): ValidationResult {
	if (!password || typeof password !== 'string') {
		return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
	}

	// Check length
	if (password.length < PASSWORD_MIN_LENGTH) {
		return { valid: false, error: ERROR_MESSAGES.PASSWORD_TOO_SHORT };
	}

	return { valid: true };
}

/**
 * Check if a password is valid (boolean version)
 *
 * @param password - The password to check
 * @returns True if valid, false otherwise
 *
 * @example
 * if (isValidPassword('mypassword123')) {
 *   // Password is valid
 * }
 */
export function isValidPassword(password: string): boolean {
	return validatePassword(password).valid;
}

/**
 * Validate password and throw error if invalid
 *
 * @param password - The password to validate
 * @throws {ValidationError} If password is invalid
 *
 * @example
 * try {
 *   assertValidPassword(userInput);
 * } catch (error) {
 *   // Handle validation error
 * }
 */
export function assertValidPassword(password: string): void {
	const result = validatePassword(password);
	if (!result.valid) {
		throw new ValidationError(result.error || ERROR_MESSAGES.PASSWORD_TOO_SHORT, 'password');
	}
}
