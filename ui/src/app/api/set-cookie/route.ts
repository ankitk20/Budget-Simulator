import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: "Token missing" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Cookie set" });

  response.cookies.set({
    name: "idToken",
    value: idToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });

  return response;
}
