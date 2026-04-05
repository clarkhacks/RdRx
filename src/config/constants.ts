/**
 * Application-wide constants and configuration values
 * 
 * This file centralizes all magic strings, numbers, and configuration
 * values used throughout the application to improve maintainability
 * and reduce duplication.
 */

// ============================================================================
// Authentication & Security
// ============================================================================

/** Minimum password length for user accounts */
export const PASSWORD_MIN_LENGTH = 8;

/** Number of PBKDF2 iterations for password hashing */
export const PBKDF2_ITERATIONS = 100000;

/** Length of salt for password hashing (in bytes) */
export const SALT_LENGTH = 16;

/** Session cookie name */
export const SESSION_COOKIE_NAME = 'session';

/** Session expiry duration in days */
export const SESSION_EXPIRY_DAYS = 7;

/** Reset token expiry duration in hours */
export const RESET_TOKEN_EXPIRY_HOURS = 1;

/** API key prefix */
export const API_KEY_PREFIX = 'rdrx_live_';

/** API key random portion length */
export const API_KEY_LENGTH = 24;

// ============================================================================
// URL Shortening
// ============================================================================

/** Default shortcode length */
export const SHORTCODE_LENGTH = 6;

/** Characters allowed in shortcodes */
export const SHORTCODE_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Prefix for file upload shortcodes */
export const FILE_SHORTCODE_PREFIX = 'f-';

/** Prefix for code snippet shortcodes */
export const SNIPPET_SHORTCODE_PREFIX = 'c-';

/** Temporary URL expiry duration in days */
export const TEMP_URL_EXPIRY_DAYS = 2;

// ============================================================================
// Database
// ============================================================================

/** Maximum number of retries for database operations */
export const DB_MAX_RETRIES = 3;

/** Delay between database retries in milliseconds */
export const DB_RETRY_DELAY_MS = 1000;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  
  // Validation
  INVALID_EMAIL: 'Invalid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  INVALID_URL: 'Invalid URL format',
  INVALID_SHORTCODE: 'Invalid shortcode format',
  
  // Resources
  SHORTCODE_EXISTS: 'Shortcode already exists',
  SHORTCODE_NOT_FOUND: 'Shortcode not found',
  FILE_NOT_FOUND: 'File not found',
  
  // Server
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
  INVALID_REQUEST: 'Invalid request body',
  MISSING_REQUIRED_FIELD: 'Missing required field',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTRATION_SUCCESS: 'Registration successful. Please check your email to verify your account.',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  
  // Resources
  URL_CREATED: 'Short URL created successfully',
  URL_DELETED: 'URL deleted successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  
  // Profile
  PROFILE_UPDATED: 'Profile updated successfully',
  API_KEY_GENERATED: 'API key generated successfully',
} as const;

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
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ============================================================================
// CORS Configuration
// ============================================================================

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
} as const;

// ============================================================================
// Content Types
// ============================================================================

export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html',
  TEXT: 'text/plain',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
} as const;

// ============================================================================
// Regex Patterns
// ============================================================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SHORTCODE: /^[a-zA-Z0-9_-]+$/,
  API_KEY: /^rdrx_live_[a-zA-Z0-9]{24}$/,
} as const;

// ============================================================================
// Feature Flags
// ============================================================================

export const FEATURES = {
  SIGNUPS_ENABLED: false, // Controlled by DISABLE_SIGNUPS env var
  API_KEYS_ENABLED: true,
  BIO_PAGES_ENABLED: true,
  ANALYTICS_ENABLED: true,
} as const;
