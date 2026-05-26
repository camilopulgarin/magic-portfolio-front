import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const frontendCallbackUrl = `${request.nextUrl.origin}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  const redirectUrl = `${API_URL}/api/auth/google?callbackUrl=${encodeURIComponent(frontendCallbackUrl)}`;

  return NextResponse.redirect(redirectUrl);
}
