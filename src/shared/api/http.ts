import { PUBLIC_ENV } from "@/shared/config";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getRuntimeWsBaseUrl(): string {
  if (PUBLIC_ENV.WS_BASE_URL) {
    return trimTrailingSlash(PUBLIC_ENV.WS_BASE_URL);
  }

  if (PUBLIC_ENV.API_BASE_URL) {
    return trimTrailingSlash(PUBLIC_ENV.API_BASE_URL).replace(/^http/i, "ws");
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  return `${protocol}//${window.location.host}/api`;
}

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!PUBLIC_ENV.API_BASE_URL) {
    return `/api${normalizedPath}`;
  }

  return `${trimTrailingSlash(PUBLIC_ENV.API_BASE_URL)}${normalizedPath}`;
}

export function getWsUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getRuntimeWsBaseUrl()}${normalizedPath}`;
}
