/**
 * Production-ready logging utility for RdRx
 * Provides structured logging with different levels and environment-aware behavior
 */

export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	NONE = 4,
}

interface LogContext {
	[key: string]: any;
}

class Logger {
	private level: LogLevel;
	private isDevelopment: boolean;

	constructor(level: LogLevel = LogLevel.INFO) {
		this.level = level;
		// In Cloudflare Workers, we're always in production mode
		// Development logging can be controlled via the log level
		this.isDevelopment = false;
	}

	/**
	 * Set the minimum log level
	 */
	setLevel(level: LogLevel): void {
		this.level = level;
	}

	/**
	 * Log debug information (only in development)
	 */
	debug(message: string, context?: LogContext): void {
		if (this.level <= LogLevel.DEBUG && this.isDevelopment) {
			console.log(`[DEBUG] ${message}`, context || '');
		}
	}

	/**
	 * Log informational messages
	 */
	info(message: string, context?: LogContext): void {
		if (this.level <= LogLevel.INFO && this.isDevelopment) {
			console.log(`[INFO] ${message}`, context || '');
		}
	}

	/**
	 * Log warning messages
	 */
	warn(message: string, context?: LogContext): void {
		if (this.level <= LogLevel.WARN) {
			console.warn(`[WARN] ${message}`, context || '');
		}
	}

	/**
	 * Log error messages (always logged)
	 */
	error(message: string, error?: Error | unknown, context?: LogContext): void {
		if (this.level <= LogLevel.ERROR) {
			const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack } : error;
			console.error(`[ERROR] ${message}`, errorDetails, context || '');
		}
	}

	/**
	 * Log successful operations (only in development)
	 */
	success(message: string, context?: LogContext): void {
		if (this.isDevelopment) {
			console.log(`[SUCCESS] ${message}`, context || '');
		}
	}
}

// Export a singleton instance
export const logger = new Logger(LogLevel.INFO);
