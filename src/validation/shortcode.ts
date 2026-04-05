/**
 * Shortcode validation utilities
 * 
 * Provides functions for validating shortcodes and custom codes.
 * 
 * @module validation/shortcode
 */

import { ValidationError } from '../errors';
import { ERROR_MESSAGES, REGEX_PATTERNS } from '../config/constants';
import { ValidationResult } from './url';

/**
 * Validates a shortcode format
 * 
 * Shortcodes must be:
 * - 3-50 characters long
 * - Contain only letters, numbers, hyphens, and underscores
 * 
 * @param code - The shortcode to validate
 * @param throwOnError - If true, throws ValidationError instead of returning result
 * @returns Validation result object
 * 
 * @example
 * const result = validateShortcode('my-link');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateShortcode(code: string, throwOnError: boolean = false): ValidationResult {
	// Check length
	if (code.length < 3 || code.length > 50) {
		const error = 'Shortcode must be 3-50 characters';
		if (throwOnError) {
			throw new ValidationError(error, 'shortcode');
		}
		return { valid: false, error };
	}

	// Check format
	if (!REGEX_PATTERNS.SHORTCODE.test(code)) {
		const error = 'Shortcode can only contain letters, numbers, hyphens, and underscores';
		if (throwOnError) {
			throw new ValidationError(error, 'shortcode');
		}
		return { valid: false, error };
	}

	return { valid: true };
}

/**
 * Validates a custom shortcode (user-provided)
 * 
 * Same as validateShortcode but also checks for reserved words
 * 
 * @param code - The custom shortcode to validate
 * @param throwOnError - If true, throws ValidationError instead of returning result
 * @returns Validation result object
 */
export function validateCustomShortcode(code: string, throwOnError: boolean = false): ValidationResult {
	// First validate basic format
	const basicValidation = validateShortcode(code, false);
	if (!basicValidation.valid) {
		if (throwOnError) {
			throw new ValidationError(basicValidation.error!, 'custom_code');
		}
		return basicValidation;
	}

	// Check for reserved words
	const reservedWords = [
		'api', 'admin', 'dashboard', 'login', 'logout', 'register',
		'verify', 'reset-password', 'account', 'bio', 'analytics',
		'upload', 'temp', 'static', 'assets', 'privacy', 'terms',
	];

	if (reservedWords.includes(code.toLowerCase())) {
		const error = 'This shortcode is reserved and cannot be used';
		if (throwOnError) {
			throw new ValidationError(error, 'custom_code');
		}
		return { valid: false, error };
	}

	return { valid: true };
}
