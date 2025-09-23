/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    user?: {
      id: number;
      email: string;
      username: string;
      is_admin: boolean;
    };
    isAuthenticated: boolean;
  }
}

interface Env {
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
