/**
 * @deprecated This file has been split into domain-specific modules.
 * Import from '../database' instead.
 * 
 * This file will be removed in a future version.
 * 
 * Migration guide:
 * - All database functions are now available from '../database'
 * - hashPassword() should be imported from '../utils/crypto' for better security
 * 
 * @example
 * // Old way (deprecated)
 * import { saveUrlToDatabase, hashPassword } from '../utils/database';
 * 
 * // New way
 * import { saveUrlToDatabase } from '../database';
 * import { hashPassword } from '../utils/crypto';
 */

// Re-export everything from the new database module for backward compatibility
export * from '../database';
