import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const frontendCallbackUrl = `${request.nextUrl.origin}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const redirectUrl = `${apiUrl}/api/auth/google?callbackUrl=${encodeURIComponent(frontendCallbackUrl)}`;

  return NextResponse.redirect(redirectUrl);
}