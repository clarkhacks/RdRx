/**
 * @deprecated This file has been refactored into src/routes/bio/
 * Please use the new modular structure:
 * - src/routes/bio/handlers.ts - Bio page handlers (form, editor, view, save, get)
 * - src/routes/bio/upload.ts - OG image upload handler
 * - src/routes/bio/index.ts - Re-exports all handlers
 */

// Re-export from the new modular structure for backward compatibility
export { handleBioFormPage, handleBioEditorPage, handleGetUserBio, handleSaveBio, handleViewBio, handleOgImageUpload } from './bio/index';
