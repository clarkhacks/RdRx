import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.isAuthenticated || !locals.user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Not authenticated'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: locals.user.id,
        email: locals.user.email,
        username: locals.user.username,
        is_admin: locals.user.is_admin,
        name: locals.user.username, // Use username as display name for now
        uid: locals.user.id // Add uid for compatibility
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Get user info error:', error);
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
