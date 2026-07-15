export function formatAdminCrackSafeRuleDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined
  }).format(date);
}
