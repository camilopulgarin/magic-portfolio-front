import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const cookieHeader = cookieStore.toString();

  if (refreshToken) {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');

  return response;
}
