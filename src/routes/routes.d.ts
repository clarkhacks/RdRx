import { Env } from '../types';

/**
 * Type declarations for route handlers
 */

/**
 * Handle analytics routes
 */
export function handleAnalyticsRoutes(request: Request, env: Env, path: string): Promise<Response>;

/**
 * Handle authentication routes
 */
export function handleAuthRoutes(request: Request, env: Env, path: string): Promise<Response>;

/**
 * Handle shortcode routes
 */
export function handleShortcodeRoutes(request: Request, env: Env, shortcode: string): Promise<Response>;

/**
 * Handle API routes
 */
export function handleApiRoutes(request: Request, env: Env): Promise<Response>;
