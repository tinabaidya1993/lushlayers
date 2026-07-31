import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'lush_layers_default_secret_key_8472910';
export const AUTH_COOKIE_NAME = 'lush_admin_token';
const TOKEN_EXPIRY_DAYS = 7;

export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Hash plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password against bcrypt hash
 */
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

/**
 * Sign JWT Token
 */
export function signJwtToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${TOKEN_EXPIRY_DAYS}d`,
  });
}

/**
 * Verify JWT Token
 */
export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Attach HttpOnly Security Cookie to NextResponse
 */
export function setAuthCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY_DAYS * 24 * 60 * 60, // 7 Days
    path: '/',
  });
  return res;
}

/**
 * Clear Auth Cookie on Logout
 */
export function clearAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return res;
}
