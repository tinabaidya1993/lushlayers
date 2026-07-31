import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No active token found.' }, { status: 401 });
  }

  const payload = verifyJwtToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Token expired or invalid.' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: payload,
  });
}
