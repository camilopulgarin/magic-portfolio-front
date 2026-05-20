import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  if (refreshToken) {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
    }
  }

  const response = NextResponse.json({ success: true });
  
  response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
  response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

  return response;
}

export async function GET(request: NextRequest) {
  return POST(request);
}