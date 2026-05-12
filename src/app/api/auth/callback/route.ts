import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login?error=no_token", request.url));
  }

  const redirectUrl = new URL("/oauth-callback", request.url);
  redirectUrl.searchParams.set("accessToken", accessToken);
  redirectUrl.searchParams.set("refreshToken", refreshToken);
  redirectUrl.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(redirectUrl);
}