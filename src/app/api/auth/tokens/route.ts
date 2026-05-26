import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'No tokens' }, { status: 401 });
  }

  return NextResponse.json({ accessToken, refreshToken });
}
