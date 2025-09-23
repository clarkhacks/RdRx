import type { APIRoute } from 'astro';
import { hashPassword } from '../../utils/auth';

export const POST: APIRoute = async ({ locals }) => {
  try {
    // Get database connection from locals (Cloudflare runtime)
    const { DB } = locals.runtime.env;
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

    // Create a test user
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    const testUsername = 'testuser';
    
    // Hash the password
    const hashedPassword = await hashPassword(testPassword);

    // Insert test user
    await DB.prepare(`
      INSERT OR REPLACE INTO users (email, username, password_hash, is_admin, email_verified)
      VALUES (?, ?, ?, ?, ?)
    `).bind(testEmail, testUsername, hashedPassword, false, true).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Test user created successfully',
      credentials: {
        email: testEmail,
        password: testPassword,
        username: testUsername
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Test user creation error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create test user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
