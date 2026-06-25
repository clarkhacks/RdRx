import { ValidationError } from '../errors';
import { ERROR_MESSAGES, URL_REGEX } from '../config/constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Validate a URL string
 *
 * @param url - The URL to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * const result = validateUrl('https://example.com');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateUrl(url: string): ValidationResult {
	if (!url || typeof url !== 'string') {
		return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
	}

	// Basic regex check
	if (!URL_REGEX.test(url)) {
		return { valid: false, error: ERROR_MESSAGES.INVALID_URL };
	}

	// Try to parse as URL
	try {
		const parsedUrl = new URL(url);

		// Ensure it's http or https
		if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
			return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
		}

		return { valid: true };
	} catch {
		return { valid: false, error: ERROR_MESSAGES.INVALID_URL };
	}
}

/**
 * Check if a URL is valid (boolean version)
 *
 * @param url - The URL to check
 * @returns True if valid, false otherwise
 *
 * @example
 * if (isValidUrl('https://example.com')) {
 *   // URL is valid
 * }
 */
export function isValidUrl(url: string): boolean {
	return validateUrl(url).valid;
}

/**
 * Validate URL and throw error if invalid
 *
 * @param url - The URL to validate
 * @throws {ValidationError} If URL is invalid
 *
 * @example
 * try {
 *   assertValidUrl(userInput);
 * } catch (error) {
 *   // Handle validation error
 * }
 */
export function assertValidUrl(url: string): void {
	const result = validateUrl(url);
	if (!result.valid) {
		throw new ValidationError(result.error || ERROR_MESSAGES.INVALID_URL, 'url');
	}
}
