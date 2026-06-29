"use client";

import { Dialog } from "@/shared/ui/Dialog";

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
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <h2>✅ VPN готов</h2>

      <p>Германия</p>
      <p>1 ГБ бесплатно</p>

      <textarea
        readOnly
        value={subscriptionUrl}
        rows={4}
        style={{ width: "100%" }}
      />

      <button
        onClick={() => navigator.clipboard.writeText(subscriptionUrl)}
      >
        Скопировать подписку
      </button>

      <button onClick={onClose}>
        Закрыть
      </button>
    </Dialog>
  );
}
