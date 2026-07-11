import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { PrizeButton, useMyPrizes } from "@/entities/prizes";

import { MyPrizesModal } from "./my-prizes-modal";

type MyPrizesTriggerProps = {
  className?: string;
};

export function MyPrizesTrigger({ className }: MyPrizesTriggerProps) {
  const { t } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const myPrizesQuery = useMyPrizes({ enabled: isModalOpen });

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <>
      <PrizeButton
        ref={triggerRef}
        className={className}
        ariaLabel={t("myPrizes.open")}
        onClick={openModal}
      />
      <MyPrizesModal
        isOpen={isModalOpen}
        isError={myPrizesQuery.isError}
        isLoading={myPrizesQuery.isLoading}
        onClose={closeModal}
        prizes={myPrizesQuery.data ?? []}
      />
    </>
  );
}
