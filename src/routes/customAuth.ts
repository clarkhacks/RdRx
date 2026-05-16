/**
 * @deprecated This file has been refactored into src/routes/auth/
 * Please use the new modular structure:
 * - src/routes/auth/api.ts - API handlers
 * - src/routes/auth/pages.ts - Page handlers
 * - src/routes/auth/index.ts - Route aggregator
 */

// Re-export from the new modular structure for backward compatibility
export { handleCustomAuthRoutes } from './auth/index';
