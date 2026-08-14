export function crackSafeRuleQueryKey(startDate: string) {
  return ["crack-safe-rule", startDate] as const;
}
