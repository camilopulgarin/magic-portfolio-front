import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  
  const frontendCallback = `${request.nextUrl.origin}/api/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  
  const redirectUrl = `${apiUrl}/auth/google?callbackUrl=${encodeURIComponent(frontendCallback)}`;

  return NextResponse.redirect(redirectUrl);
}