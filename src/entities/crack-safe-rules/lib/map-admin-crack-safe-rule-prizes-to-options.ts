import { type AdminCrackSafeRulePrizeOption } from "../ui/types";

type AdminCrackSafeRulePrizeOptionSource = Pick<AdminCrackSafeRulePrizeOption, "id" | "name">;

export function mapAdminCrackSafeRulePrizesToOptions(
  prizes: AdminCrackSafeRulePrizeOptionSource[] | undefined
): AdminCrackSafeRulePrizeOption[] {
  return (
    prizes?.map((prize) => ({
      id: prize.id,
      name: prize.name
    })) ?? []
  );
}
