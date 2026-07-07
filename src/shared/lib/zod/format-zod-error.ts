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
