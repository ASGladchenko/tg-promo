export function formatAdminPrizeMetadata(metadata: Record<string, unknown>) {
  const entries = Object.entries(metadata);

  if (!entries.length) {
    return "-";
  }

  return JSON.stringify(metadata);
}
