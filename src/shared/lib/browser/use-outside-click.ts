import { type RefObject, useEffect } from "react";

type UseOutsideClickOptions = {
  enabled: boolean;
  onOutsideClick: () => void;
  ref: RefObject<HTMLElement | null>;
};

export function useOutsideClick({ enabled, onOutsideClick, ref }: UseOutsideClickOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && !ref.current?.contains(target)) {
        onOutsideClick();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [enabled, onOutsideClick, ref]);
}
