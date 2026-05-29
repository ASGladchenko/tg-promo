import { PUBLIC_ENV } from "@/shared/config/public-env";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!PUBLIC_ENV.API_BASE_URL) {
    return normalizedPath;
  }

  return `${trimTrailingSlash(PUBLIC_ENV.API_BASE_URL)}${normalizedPath}`;
}
