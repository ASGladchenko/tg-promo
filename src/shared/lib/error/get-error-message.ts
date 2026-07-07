import { type z } from "zod";

function formatZodIssuePath(path: Array<number | string | symbol>) {
  return path.length > 0 ? path.map(String).join(".") : "root";
}

export function formatZodError(error: z.ZodError, message: string) {
  const issue = error.issues[0];

  if (!issue) {
    return `${message}: unknown validation error`;
  }

  return `${message}: ${formatZodIssuePath(issue.path)}: ${issue.message}`;
}

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function readResponseErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const body: unknown = await response.json();

    if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
      return body.message;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}
