import { SelectOption } from "@/shared/ui/select-option";

import { type AdminCrackSafeRulePrizeOption } from "./types";

type AdminCrackSafeRulePrizeOptionsProps = {
  onSelect: (value: string) => void;
  prizeOptions: AdminCrackSafeRulePrizeOption[];
  value: string;
};

export function AdminCrackSafeRulePrizeOptions({
  onSelect,
  prizeOptions,
  value
}: AdminCrackSafeRulePrizeOptionsProps) {
  return (
    <>
      {prizeOptions.map((prizeOption) => (
        <SelectOption
          onSelect={onSelect}
          key={prizeOption.id}
          value={prizeOption.id}
          isSelected={prizeOption.id === value}
        >
          {prizeOption.name}
        </SelectOption>
      ))}
    </>
  );
}
