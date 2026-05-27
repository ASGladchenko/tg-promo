import { NextResponse } from "next/server";
import { clearSessionCookie, readSessionFromRequest } from "@/src/backend/auth/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = readSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
    source: session.source
  });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
