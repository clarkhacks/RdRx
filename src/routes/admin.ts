/**
 * @deprecated This file has been refactored into src/routes/admin/
 * Please use the new modular structure:
 * - src/routes/admin/users.ts - User management
 * - src/routes/admin/urls.ts - URL management
 * - src/routes/admin/stats.ts - Statistics and analytics
 * - src/routes/admin/email.ts - Email configuration and testing
 * - src/routes/admin/index.ts - Route aggregator
 */

// Re-export from the new modular structure for backward compatibility
export { handleAdminRoutes } from './admin/index';
