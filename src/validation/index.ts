/**
 * Validation utilities
 * 
 * This module exports all validation functions used throughout the application.
 * 
 * @module validation
 */

export { validateUrl, validateHttpsUrl, type ValidationResult } from './url';
export { validateShortcode, validateCustomShortcode } from './shortcode';
export { validateEmail, validatePassword, validateApiKey } from './auth';
