import type { APIRoute } from 'astro';
import { getUserByEmail } from '../../../utils/database';
import { verifyPassword, generateJWT } from '../../../utils/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email and password are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Get database connection from locals (Cloudflare runtime)
    const { DB, KV_RDRX, R2_RDRX, JWT_SECRET } = locals.runtime.env;
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

    // Find user by email
    const user = await getUserByEmail(env, email);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid email or password'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash as string);
    if (!isValidPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid email or password'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Generate JWT token
    const token = await generateJWT({
      id: user.id as number,
      email: user.email as string,
      username: user.username as string,
      is_admin: user.is_admin as boolean
    }, JWT_SECRET || 'default-secret');

    // Set HTTP-only cookie
    const response = new Response(JSON.stringify({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_admin: user.is_admin
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
      }
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
