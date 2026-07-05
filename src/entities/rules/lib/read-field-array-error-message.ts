export function readFieldArrayErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  if (
    "root" in error &&
    error.root &&
    typeof error.root === "object" &&
    "message" in error.root &&
    typeof error.root.message === "string"
  ) {
    return error.root.message;
  }

  return undefined;
}
