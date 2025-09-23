import { SignJWT, jwtVerify } from 'jose';

export interface UserPayload {
  id: number;
  email: string;
  username: string;
  is_admin: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  // Use Web Crypto API for password hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

export async function generateJWT(payload: UserPayload, secret: string): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  
  const jwt = await new SignJWT({
    id: payload.id,
    email: payload.email,
    username: payload.username,
    is_admin: payload.is_admin
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
    
  return jwt;
}

export async function verifyJWT(token: string, secret: string): Promise<UserPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    
    return {
      id: payload.id as number,
      email: payload.email as string,
      username: payload.username as string,
      is_admin: payload.is_admin as boolean
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function getCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const targetCookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
  
  return targetCookie ? targetCookie.split('=')[1] : null;
}

export function getAuthToken(request: Request): string | null {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Fallback to cookie
  return getCookieValue(request, 'auth_token');
}
