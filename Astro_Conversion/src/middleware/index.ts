import { defineMiddleware } from 'astro:middleware';
import { getAuthToken, verifyJWT } from '../utils/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals } = context;
  
  // Initialize locals with default values
  locals.isAuthenticated = false;
  locals.user = undefined;
  
  // Get auth token from request
  const token = getAuthToken(request);
  
  if (token && locals.runtime?.env) {
    try {
      const { JWT_SECRET } = locals.runtime.env;
      const user = await verifyJWT(token, JWT_SECRET || 'default-secret');
      if (user) {
        locals.isAuthenticated = true;
        locals.user = user;
      }
    } catch (error) {
      console.error('Auth validation failed:', error);
    }
  }
  
  return next();
});
