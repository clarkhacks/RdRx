/**
 * Error classes for the application
 * 
 * This module exports all custom error classes used throughout the application.
 * All errors extend the base AppError class and provide consistent error handling.
 * 
 * @module errors
 */

export { AppError } from './AppError';
export { ValidationError } from './ValidationError';
export { AuthenticationError } from './AuthenticationError';
export { NotFoundError } from './NotFoundError';
export { ConflictError } from './ConflictError';
