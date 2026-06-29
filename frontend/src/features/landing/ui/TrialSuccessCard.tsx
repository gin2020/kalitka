"use client";

import { Button } from "@/shared/ui";

type Props = {
  subscriptionUrl: string;
  onCopy: () => void;
};

export function TrialSuccessCard({
  subscriptionUrl,
  onCopy,
}: Props) {
  function openHapp() {
    window.location.href = subscriptionUrl;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 54,
          }}
        >
          ✅
        </div>

        <h2>VPN готов</h2>

        <p>
          Ваш VPN успешно создан.
        </p>
      </div>

      <div
        style={{
          padding: 16,
          borderRadius: 12,
          background: "#f5f5f5",
        }}
      >
        <strong>🇩🇪 Германия</strong>

        <br />

        <small>1 ГБ бесплатно</small>

        <br />
        <br />

        <small>VLESS Reality</small>

        <br />

        <small>Hysteria 2</small>
      </div>

      <Button onClick={openHapp}>
        📲 Открыть Happ
      </Button>

      <Button
        variant="secondary"
        onClick={onCopy}
      >
        📋 Скопировать подписку
      </Button>
    </div>
  );
}
