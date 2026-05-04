/**
 * Centralized error classes for the application
 * 
 * This module exports all custom error types used throughout the application.
 * All errors extend the base AppError class for consistent handling.
 */

export { AppError } from './AppError';
export { ValidationError } from './ValidationError';
export { AuthenticationError } from './AuthenticationError';
export { NotFoundError } from './NotFoundError';
export { ConflictError } from './ConflictError';
