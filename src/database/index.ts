/**
 * Database operations module
 * 
 * This module provides all database operations organized by domain.
 * 
 * @module database
 */

// Initialization
export { initializeTables } from './init';

// URL operations
export { saveUrlToDatabase, fetchUrlByShortcode, getUrlFromDatabase, deleteUrlByShortcode } from './urls';

// Password operations
export { isShortcodePasswordProtected, verifyShortcodePassword, hashPassword } from './passwords';

// Analytics operations
export { trackView, getAnalytics } from './analytics';
export type { AnalyticsData } from './analytics';

// Deletion operations
export { saveDeletionEntry, getDeletionEntries, deleteDeletionEntry, executeScheduledDeletions } from './deletion';
export type { DeletionEntry } from './deletion';

// Bio operations
export {
	saveBioProfile,
	getBioProfile,
	getUserBioPage,
	getBioPage,
	getBioLinks,
	getBioSocialMedia,
	updateBioProfile,
	deleteBioProfile,
	isBioShortcodeAvailable,
} from './bio';
export type { BioProfile } from './bio';
