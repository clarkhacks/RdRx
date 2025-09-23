import type { APIRoute } from 'astro';
import { initializeTables } from '../../utils/database';

export const POST: APIRoute = async ({ locals }) => {
  try {
    // Get database connection from locals (Cloudflare runtime)
    const { DB, KV_RDRX, R2_RDRX } = locals.runtime.env;
    if (!DB) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Database connection not available'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const env = { DB, KV_RDRX, R2_RDRX };

    // Initialize database tables
    await initializeTables(env);

    return new Response(JSON.stringify({
      success: true,
      message: 'Database tables initialized successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to initialize database tables',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
