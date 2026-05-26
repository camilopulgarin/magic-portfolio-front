import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api/config';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (refreshToken) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {}
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
  response.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });

  return response;
}

export async function GET(request: NextRequest) {
  return POST(request);
}
