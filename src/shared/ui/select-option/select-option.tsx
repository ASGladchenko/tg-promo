import clsx from "clsx";

type SelectOptionProps = {
  children: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
  value: string;
};

export function SelectOption({ children, isSelected, onSelect, value }: SelectOptionProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(value)}
      className={clsx("select-field__option", { "select-field__option--selected": isSelected })}
    >
      {children}
    </button>
  );
}
