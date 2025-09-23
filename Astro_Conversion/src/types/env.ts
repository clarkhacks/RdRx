export interface Env {
  DB: D1Database;
  KV_RDRX: KVNamespace;
  R2_RDRX: R2Bucket;
  FRONTEND_URL: string;
  SHORT_DOMAIN: string;
  MAILGUN_DOMAIN: string;
  FROM_EMAIL: string;
  R2_URL: string;
  DISABLE_SIGNUPS: string;
  MAILGUN_API_KEY?: string;
  JWT_SECRET?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  is_admin: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  isAuthenticated: boolean;
}
