"use client";

import { Dialog } from "@/shared/ui/Dialog/Dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  subscriptionUrl: string;
};

export function TrialDialog({
  open,
  onClose,
  subscriptionUrl,
}: Props) {
  async function copySubscription() {
    await navigator.clipboard.writeText(subscriptionUrl);
    onClose();
  }

  return (
    <Dialog
      isOpen={open}
      onCancel={onClose}
      onConfirm={copySubscription}
      confirmLabel="Скопировать подписку"
      cancelLabel="Закрыть"
      title="✅ VPN готов"
    >
      <p>Германия</p>

      <p>1 ГБ бесплатно</p>

      <textarea
        readOnly
        value={subscriptionUrl}
        rows={4}
        style={{ width: "100%" }}
      />
    </Dialog>
  );
}
