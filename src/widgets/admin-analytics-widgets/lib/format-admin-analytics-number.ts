const adminAnalyticsNumberFormatter = new Intl.NumberFormat("en-US");

export function formatAdminAnalyticsNumber(value: number | undefined): string {
  return value === undefined ? "--" : adminAnalyticsNumberFormatter.format(value);
}
