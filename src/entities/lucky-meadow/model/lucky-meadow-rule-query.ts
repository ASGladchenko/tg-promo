export function luckyMeadowRuleQueryKey(startDate: string) {
  return ["lucky-meadow-rule", startDate] as const;
}
