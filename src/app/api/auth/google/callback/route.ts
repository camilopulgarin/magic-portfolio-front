import { NextRequest, NextResponse } from "next/server";

function isValidCallbackUrl(url: string, baseUrl: string): boolean {
  try {
    const parsed = new URL(url, baseUrl);
    return parsed.origin === baseUrl;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const callbackUrlParam = searchParams.get("callbackUrl");

  let callbackUrl = callbackUrlParam || "/dashboard";

  const baseUrl = request.nextUrl.origin;
  if (!isValidCallbackUrl(callbackUrl, baseUrl)) {
    callbackUrl = "/dashboard";
  }

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const backendResponse = await fetch(
      `${apiUrl}/api/auth/google/callback?code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        credentials: "include",
        redirect: "manual",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    const setCookie = backendResponse.headers.get("set-cookie");
    
    if (setCookie) {
      const tokens = parseAllCookies(setCookie);
      
      if (tokens.accessToken && tokens.refreshToken) {
        const response = NextResponse.redirect(new URL(callbackUrl, request.url));

        response.cookies.set("accessToken", tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60,
          path: "/",
        });
        response.cookies.set("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        return response;
      }
    }

    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }
}

function parseAllCookies(setCookie: string): { accessToken?: string; refreshToken?: string } {
  const result: { accessToken?: string; refreshToken?: string } = {};
  
  const cookies = setCookie.split(",").map(c => c.trim());
  
  for (const cookie of cookies) {
    if (cookie.startsWith("access_token=")) {
      const match = cookie.match(/access_token=([^;]+)/);
      if (match) result.accessToken = match[1];
    } else if (cookie.startsWith("refresh_token=")) {
      const match = cookie.match(/refresh_token=([^;]+)/);
      if (match) result.refreshToken = match[1];
    }
  }
  
  return result;
}