import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const code = searchParams.get("code");

  if (code) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    try {
      const response = await fetch(`${apiUrl}/auth/google/callback?code=${code}`, {
        method: "GET",
        credentials: "include",
        redirect: "manual",
      });

      const location = response.headers.get("location");
      
      if (location) {
        const urlObj = new URL(location);
        const accessToken = urlObj.searchParams.get("accessToken");
        const refreshToken = urlObj.searchParams.get("refreshToken");
        
        if (accessToken && refreshToken) {
          const frontendCallback = new URL("/oauth-callback", request.url);
          frontendCallback.searchParams.set("accessToken", accessToken);
          frontendCallback.searchParams.set("refreshToken", refreshToken);
          return NextResponse.redirect(frontendCallback);
        }
        
        return NextResponse.redirect(location);
      }
      
      return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
    } catch {
      return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
    }
  }

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (accessToken && refreshToken) {
    const redirectUrl = new URL("/oauth-callback", request.url);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
}