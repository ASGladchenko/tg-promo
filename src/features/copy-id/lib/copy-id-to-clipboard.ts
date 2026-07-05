export function copyIdToClipboard(id: string) {
  void navigator.clipboard?.writeText(id);
}
