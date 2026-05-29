import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "tg_session";
const SESSION_VERSION = 1;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionAuthSource = "miniapp" | "widget";

export type SessionUser = {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
};

type SessionPayload = {
  v: number;
  src: SessionAuthSource;
  user: SessionUser;
  iat: number;
  exp: number;
};

type SameSiteValue = "lax" | "strict" | "none";

function getSessionSecret(): string {
  const secret = process.env.APP_SESSION_SECRET ?? process.env.TELEGRAM_BOT_TOKEN;
  if (!secret) {
    throw new Error("Missing APP_SESSION_SECRET or TELEGRAM_BOT_TOKEN.");
  }
  return secret;
}

function getCookieSameSite(): SameSiteValue {
  const configured = (process.env.APP_SESSION_COOKIE_SAME_SITE ?? "lax").trim().toLowerCase();
  if (configured === "none" || configured === "strict" || configured === "lax") {
    return configured;
  }
  return "lax";
}

function isSecureCookie(sameSite: SameSiteValue): boolean {
  return process.env.NODE_ENV === "production" || sameSite === "none";
}

function sign(payloadBase64: string): string {
  return createHmac("sha256", getSessionSecret()).update(payloadBase64).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
}

function decodePayload(payloadBase64: string): SessionPayload | null {
  try {
    const raw = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw) as SessionPayload;
    if (parsed.v !== SESSION_VERSION) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function createSessionToken(user: SessionUser, source: SessionAuthSource): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    v: SESSION_VERSION,
    src: source,
    user,
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };
  const payloadBase64 = encodePayload(payload);
  const signature = sign(payloadBase64);
  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) {
    return null;
  }
  const expectedSignature = sign(payloadBase64);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  const payload = decodePayload(payloadBase64);
  if (!payload) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(payload.exp) || payload.exp <= now) {
    return null;
  }

  if (!payload.user?.id || !payload.user.firstName) {
    return null;
  }

  return payload;
}

export function readSessionFromRequest(request: Request | { headers?: unknown }): {
  user: SessionUser;
  source: SessionAuthSource;
} | null {
  const cookieHeader = getCookieHeader(request);
  if (!cookieHeader) {
    return null;
  }

  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

  if (!token) {
    return null;
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return null;
  }

  return {
    user: payload.user,
    source: payload.src
  };
}

type CookieResponse = {
  cookie?: (name: string, value: string, options: Record<string, unknown>) => void;
  getHeader?: (name: string) => number | string | string[] | undefined;
  setHeader?: (name: string, value: number | string | readonly string[]) => void;
};

function getCookieHeader(request: Request | { headers?: unknown }): string | null {
  const headers = (request as { headers?: unknown }).headers;
  if (!headers) {
    return null;
  }

  if (
    typeof headers === "object" &&
    headers !== null &&
    "get" in headers &&
    typeof (headers as Headers).get === "function"
  ) {
    return (headers as Headers).get("cookie");
  }

  if (typeof headers === "object" && headers !== null && "cookie" in headers) {
    const cookieValue = (headers as { cookie?: string | string[] }).cookie;
    if (Array.isArray(cookieValue)) {
      return cookieValue.join("; ");
    }
    return cookieValue ?? null;
  }

  return null;
}

function serializeCookie(name: string, value: string, maxAgeSeconds: number): string {
  const sameSite = getCookieSameSite();
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    `SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`,
    `Max-Age=${maxAgeSeconds}`
  ];

  if (isSecureCookie(sameSite)) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function appendSetCookieHeader(response: CookieResponse, cookieValue: string) {
  if (!response.setHeader || !response.getHeader) {
    return;
  }

  const current = response.getHeader("Set-Cookie");
  if (!current) {
    response.setHeader("Set-Cookie", cookieValue);
    return;
  }

  if (Array.isArray(current)) {
    response.setHeader("Set-Cookie", [...current, cookieValue]);
    return;
  }

  response.setHeader("Set-Cookie", [String(current), cookieValue]);
}

export function setSessionCookie(
  response: CookieResponse,
  token: string,
  maxAgeSeconds: number = SESSION_TTL_SECONDS
) {
  const sameSite = getCookieSameSite();

  if (response.cookie) {
    response.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite,
      secure: isSecureCookie(sameSite),
      path: "/",
      maxAge: maxAgeSeconds * 1000
    });
    return;
  }

  appendSetCookieHeader(response, serializeCookie(SESSION_COOKIE_NAME, token, maxAgeSeconds));
}

export function clearSessionCookie(response: CookieResponse) {
  const sameSite = getCookieSameSite();

  if (response.cookie) {
    response.cookie(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite,
      secure: isSecureCookie(sameSite),
      path: "/",
      maxAge: 0
    });
    return;
  }

  appendSetCookieHeader(response, serializeCookie(SESSION_COOKIE_NAME, "", 0));
}
