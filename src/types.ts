/**
 * Environment variables and configuration
 */
export interface Env {
	// Clerk authentication
	CLERK_API_KEY: string;
	CLERK_FRONTEND_API: string;
	CLERK_PUBLISHABLE_KEY: string;
	CLERK_JWT_KEY?: string;

	// Custom authentication
	JWT_SECRET: string;
	MAILGUN_DOMAIN: string;
	MAILGUN_API_KEY: string;
	FROM_EMAIL?: string;
	FRONTEND_URL?: string;

	// Storage
	R2_RDRX: R2Bucket;
	DB: D1Database;
	KV_RDRX: KVNamespace;

	// API keys
	API_KEY: string;
	API_KEY_ADMIN: string;
}

/**
 * Analytics view data
 */
export interface ViewData {
	timestamp: string;
	ip?: string;
	userAgent?: string;
	referrer?: string;
	screenWidth?: number;
	screenHeight?: number;
	language?: string;
	location?: {
		country?: string;
		city?: string;
		region?: string;
		latitude?: number;
		longitude?: number;
		postalCode?: string;
		timezone?: string;
	};
}

/**
 * Request body for creating a short URL
 */
export interface CreateShortUrlRequest {
	url?: string;
	custom?: boolean;
	custom_code?: string;
	admin_override_code?: string;
	delete_after?: string;
	snippet?: string;
	userId?: string;
}

/**
 * Response for creating a short URL
 */
export interface CreateShortUrlResponse {
	shortcode: string;
	message?: string;
}
