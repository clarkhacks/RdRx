import { ValidationError } from '../errors';
import { ERROR_MESSAGES, SHORTCODE_REGEX, SHORTCODE_MIN_LENGTH, SHORTCODE_MAX_LENGTH, RESERVED_SHORTCODES } from '../config/constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Validate a shortcode string
 *
 * @param code - The shortcode to validate
 * @returns Validation result with error message if invalid
 *
 * @example
 * const result = validateShortcode('my-link');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
export function validateShortcode(code: string): ValidationResult {
	if (!code || typeof code !== 'string') {
		return { valid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
	}

	// Check length
	if (code.length < SHORTCODE_MIN_LENGTH) {
		return { valid: false, error: ERROR_MESSAGES.SHORTCODE_TOO_SHORT };
	}

	if (code.length > SHORTCODE_MAX_LENGTH) {
		return { valid: false, error: ERROR_MESSAGES.SHORTCODE_TOO_LONG };
	}

	// Check format (alphanumeric, hyphens, underscores only)
	if (!SHORTCODE_REGEX.test(code)) {
		return { valid: false, error: ERROR_MESSAGES.SHORTCODE_INVALID };
	}

	// Check if reserved
	if (isReservedShortcode(code)) {
		return { valid: false, error: ERROR_MESSAGES.SHORTCODE_RESERVED };
	}

	return { valid: true };
}

/**
 * Check if a shortcode is valid (boolean version)
 *
 * @param code - The shortcode to check
 * @returns True if valid, false otherwise
 *
 * @example
 * if (isValidShortcode('my-link')) {
 *   // Shortcode is valid
 * }
 */
export function isValidShortcode(code: string): boolean {
	return validateShortcode(code).valid;
}

/**
 * Check if a shortcode is reserved
 *
 * @param code - The shortcode to check
 * @returns True if reserved, false otherwise
 *
 * @example
 * if (isReservedShortcode('admin')) {
 *   console.log('This shortcode is reserved');
 * }
 */
export function isReservedShortcode(code: string): boolean {
	return RESERVED_SHORTCODES.includes(code.toLowerCase());
}

/**
 * Validate shortcode and throw error if invalid
 *
 * @param code - The shortcode to validate
 * @throws {ValidationError} If shortcode is invalid
 *
 * @example
 * try {
 *   assertValidShortcode(userInput);
 * } catch (error) {
 *   // Handle validation error
 * }
 */
export function assertValidShortcode(code: string): void {
	const result = validateShortcode(code);
	if (!result.valid) {
		throw new ValidationError(result.error || ERROR_MESSAGES.SHORTCODE_INVALID, 'shortcode');
	}
}
