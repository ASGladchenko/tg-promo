import { type AdminRulePrizeOption } from "../ui/types";

type AdminRulePrizeOptionSource = Pick<AdminRulePrizeOption, "id" | "name">;

export function mapAdminRulePrizesToOptions(
  prizes: AdminRulePrizeOptionSource[] | undefined
): AdminRulePrizeOption[] {
  return (
    prizes?.map((prize) => ({
      id: prize.id,
      name: prize.name
    })) ?? []
  );
}
