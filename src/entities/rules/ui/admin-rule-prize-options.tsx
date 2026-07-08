import { SelectOption } from "@/shared/ui/select-option";

import { type AdminRulePrizeOption } from "./types";

type AdminRulePrizeOptionsProps = {
  onSelect: (value: string) => void;
  prizeOptions: AdminRulePrizeOption[];
  value: string;
};

export function AdminRulePrizeOptions({ onSelect, prizeOptions, value }: AdminRulePrizeOptionsProps) {
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
