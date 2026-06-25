import { Env } from '../../types';
import { handleBioFormPage, handleBioEditorPage, handleGetUserBio, handleSaveBio, handleViewBio } from './handlers';
import { handleOgImageUpload } from './upload';

// Re-export all handlers for backward compatibility
export { handleBioFormPage, handleBioEditorPage, handleGetUserBio, handleSaveBio, handleViewBio, handleOgImageUpload };
