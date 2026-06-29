"use client";

import { useState } from "react";

import { Dialog, Toast } from "@/shared/ui";
import { TrialSuccessCard } from "./TrialSuccessCard";

type Props = {
  isOpen: boolean;
  subscriptionUrl: string;
  onClose: () => void;
};

export function TrialDialog({
  isOpen,
  subscriptionUrl,
  onClose,
}: Props) {
  const [toastOpen, setToastOpen] = useState(false);

  async function copySubscription() {
    try {
      await navigator.clipboard.writeText(subscriptionUrl);
      setToastOpen(true);
    } catch {
      console.error("Clipboard error");
    }
  }

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title="VPN готов"
        cancelLabel="Закрыть"
        onCancel={onClose}
      >
        <TrialSuccessCard
          subscriptionUrl={subscriptionUrl}
          onCopy={copySubscription}
        />
      </Dialog>

      <Toast
        open={toastOpen}
        message="Подписка скопирована"
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
