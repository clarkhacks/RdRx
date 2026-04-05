/**
 * URL validation utilities
 * 
 * Provides functions for validating URLs and related data.
 * 
 * @module validation/url
 */

import { ValidationError } from '../errors';
import { ERROR_MESSAGES } from '../config/constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Validates a URL string
 * 
 * @param url - The URL string to validate
 * @param throwOnError - If true, throws ValidationError instead of returning result
 * @returns Validation result object
 * 
 * @example
 * const result = validateUrl('https://example.com');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 * 
 * @example
 * // Throws ValidationError if invalid
 * validateUrl('invalid-url', true);
 */
export function validateUrl(url: string, throwOnError: boolean = false): ValidationResult {
	try {
		new URL(url);
		return { valid: true };
	} catch {
		const error = ERROR_MESSAGES.INVALID_URL;
		if (throwOnError) {
			throw new ValidationError(error, 'url');
		}
		return { valid: false, error };
	}
}

/**
 * Validates that a URL uses HTTPS protocol
 * 
 * @param url - The URL string to validate
 * @param throwOnError - If true, throws ValidationError instead of returning result
 * @returns Validation result object
 * 
 * @example
 * const result = validateHttpsUrl('https://example.com');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateHttpsUrl(url: string, throwOnError: boolean = false): ValidationResult {
	const urlValidation = validateUrl(url, throwOnError);
	if (!urlValidation.valid) {
		return urlValidation;
	}

	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.protocol !== 'https:') {
			const error = 'URL must use HTTPS protocol';
			if (throwOnError) {
				throw new ValidationError(error, 'url');
			}
			return { valid: false, error };
		}
		return { valid: true };
	} catch {
		const error = ERROR_MESSAGES.INVALID_URL;
		if (throwOnError) {
			throw new ValidationError(error, 'url');
		}
		return { valid: false, error };
	}
}
