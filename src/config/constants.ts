/**
 * Application-wide constants and configuration values
 *
 * This file centralizes all magic numbers, strings, and configuration
 * values used throughout the application for easier maintenance.
 */

// ============================================================================
// Authentication & Security
// ============================================================================

/**
 * Minimum password length for user accounts
 */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Number of PBKDF2 iterations for password hashing
 * Higher values increase security but also computation time
 */
export const PBKDF2_ITERATIONS = 100000;

/**
 * Length of the salt used in password hashing (in bytes)
 */
export const SALT_LENGTH = 16;

/**
 * Name of the session cookie
 */
export const SESSION_COOKIE_NAME = 'session';

/**
 * Session expiry duration in days
 */
export const SESSION_EXPIRY_DAYS = 7;

/**
 * Password reset token expiry duration in hours
 */
export const RESET_TOKEN_EXPIRY_HOURS = 1;

/**
 * Email verification token expiry duration in hours
 */
export const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;

// ============================================================================
// Shortcode Configuration
// ============================================================================

/**
 * Default length for auto-generated shortcodes
 */
export const SHORTCODE_LENGTH = 6;

/**
 * Minimum length for custom shortcodes
 */
export const SHORTCODE_MIN_LENGTH = 3;

/**
 * Maximum length for custom shortcodes
 */
export const SHORTCODE_MAX_LENGTH = 50;

/**
 * Characters allowed in shortcodes
 */
export const SHORTCODE_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * API key prefix
 */
export const API_KEY_PREFIX = 'rdrx_live_';

/**
 * API key length (excluding prefix)
 */
export const API_KEY_LENGTH = 24;

/**
 * Reserved shortcodes that cannot be used by users
 */
export const RESERVED_SHORTCODES = [
	'admin',
	'api',
	'login',
	'logout',
	'register',
	'signup',
	'signin',
	'dashboard',
	'account',
	'settings',
	'profile',
	'bio',
	'analytics',
	'upload',
	'snippet',
	'create',
	'verify',
	'reset-password',
	'terms',
	'privacy',
	'static',
	'assets',
	'docs',
];

// ============================================================================
// File Upload Configuration
// ============================================================================

/**
 * Maximum file size for uploads (in bytes)
 * Default: 100MB
 */
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

/**
 * Maximum number of files per upload
 */
export const MAX_FILES_PER_UPLOAD = 10;

/**
 * Allowed file types for upload
 */
export const ALLOWED_FILE_TYPES = [
	// Images
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/svg+xml',
	// Documents
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	// Archives
	'application/zip',
	'application/x-zip-compressed',
	// Text
	'text/plain',
	'text/csv',
];

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Maximum number of requests per minute for unauthenticated users
 */
export const RATE_LIMIT_ANONYMOUS = 10;

/**
 * Maximum number of requests per minute for authenticated users
 */
export const RATE_LIMIT_AUTHENTICATED = 60;

/**
 * Maximum number of login attempts before temporary lockout
 */
export const MAX_LOGIN_ATTEMPTS = 5;

/**
 * Lockout duration after max login attempts (in minutes)
 */
export const LOGIN_LOCKOUT_DURATION = 15;

// ============================================================================
// Pagination
// ============================================================================

/**
 * Default number of items per page
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Maximum number of items per page
 */
export const MAX_PAGE_SIZE = 100;

// ============================================================================
// Analytics
// ============================================================================

/**
 * Number of days to retain analytics data
 * 0 = keep forever
 */
export const ANALYTICS_RETENTION_DAYS = 365;

/**
 * Maximum number of analytics records to return in a single query
 */
export const MAX_ANALYTICS_RECORDS = 10000;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
	// Authentication
	INVALID_CREDENTIALS: 'Invalid email or password',
	USER_NOT_FOUND: 'User not found',
	USER_ALREADY_EXISTS: 'A user with this email already exists',
	EMAIL_NOT_VERIFIED: 'Please verify your email address',
	INVALID_TOKEN: 'Invalid or expired token',
	SESSION_EXPIRED: 'Your session has expired. Please log in again.',
	UNAUTHORIZED: 'You are not authorized to perform this action',

	// Shortcodes
	SHORTCODE_EXISTS: 'This shortcode is already taken',
	SHORTCODE_INVALID: 'Shortcode can only contain letters, numbers, hyphens, and underscores',
	SHORTCODE_TOO_SHORT: `Shortcode must be at least ${SHORTCODE_MIN_LENGTH} characters`,
	SHORTCODE_TOO_LONG: `Shortcode must be at most ${SHORTCODE_MAX_LENGTH} characters`,
	SHORTCODE_RESERVED: 'This shortcode is reserved and cannot be used',
	SHORTCODE_NOT_FOUND: 'Shortcode not found',

	// URLs
	INVALID_URL: 'Please provide a valid URL',
	URL_NOT_FOUND: 'URL not found',

	// Files
	FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
	FILE_TYPE_NOT_ALLOWED: 'This file type is not allowed',
	TOO_MANY_FILES: `You can upload a maximum of ${MAX_FILES_PER_UPLOAD} files at once`,

	// Validation
	REQUIRED_FIELD: 'This field is required',
	INVALID_EMAIL: 'Please provide a valid email address',
	PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
	PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',

	// General
	INTERNAL_ERROR: 'An internal error occurred. Please try again later.',
	NOT_FOUND: 'The requested resource was not found',
	BAD_REQUEST: 'Invalid request',
	RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
};

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
	// Authentication
	LOGIN_SUCCESS: 'Login successful',
	LOGOUT_SUCCESS: 'Logout successful',
	REGISTRATION_SUCCESS: 'Registration successful. Please check your email to verify your account.',
	EMAIL_VERIFIED: 'Email verified successfully',
	PASSWORD_RESET_SENT: 'Password reset instructions have been sent to your email',
	PASSWORD_RESET_SUCCESS: 'Password reset successful',
	PASSWORD_CHANGED: 'Password changed successfully',

	// Shortcodes
	SHORTCODE_CREATED: 'Shortcode created successfully',
	SHORTCODE_UPDATED: 'Shortcode updated successfully',
	SHORTCODE_DELETED: 'Shortcode deleted successfully',

	// Files
	FILE_UPLOADED: 'File uploaded successfully',
	FILES_UPLOADED: 'Files uploaded successfully',
	FILE_DELETED: 'File deleted successfully',

	// Bio
	BIO_CREATED: 'Bio page created successfully',
	BIO_UPDATED: 'Bio page updated successfully',
	BIO_DELETED: 'Bio page deleted successfully',

	// General
	CHANGES_SAVED: 'Changes saved successfully',
	ITEM_DELETED: 'Item deleted successfully',
};

// ============================================================================
// HTTP Status Codes
// ============================================================================

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	UNPROCESSABLE_ENTITY: 422,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
};

// ============================================================================
// Regular Expressions
// ============================================================================

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shortcode validation regex
 */
export const SHORTCODE_REGEX = /^[a-zA-Z0-9_-]+$/;

/**
 * URL validation regex (basic)
 */
export const URL_REGEX = /^https?:\/\/.+/;

// ============================================================================
// Feature Flags
// ============================================================================

/**
 * Feature flags for gradual rollout of new features
 */
export const FEATURES = {
	ENABLE_EMAIL_VERIFICATION: true,
	ENABLE_PASSWORD_RESET: true,
	ENABLE_API_KEYS: true,
	ENABLE_ANALYTICS: true,
	ENABLE_FILE_UPLOAD: true,
	ENABLE_BIO_PAGES: true,
	ENABLE_SNIPPETS: true,
	ENABLE_CUSTOM_DOMAINS: false, // Not yet implemented
	ENABLE_TEAM_ACCOUNTS: false, // Not yet implemented
};
