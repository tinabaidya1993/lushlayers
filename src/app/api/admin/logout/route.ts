import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({
    success: true,
    message: 'Admin session terminated successfully.',
  });
  return clearAuthCookie(res);
}
