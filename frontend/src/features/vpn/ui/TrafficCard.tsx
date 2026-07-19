"use client";

import { useState } from "react";

import { Card, Toast } from "@/shared/ui";

import styles from "./TrafficCard.module.css";

type Props = {
  subscriptionUrl: string;
};

async function copyText(value: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function TrafficCard({ subscriptionUrl }: Props) {
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  async function handleCopy(value: string, message: string) {
    try {
      await copyText(value);
      setToastMessage(message);
      setToastOpen(true);
    } catch {
      setToastMessage("Не удалось скопировать");
      setToastOpen(true);
    }
  }

  return (
    <>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>VPN подписка готова</h2>

          <p className={styles.subtitle}>
            Доступ создан. Можно подключаться и пользоваться VPN
          </p>
        </div>

        <button
          className={styles.action}
          type="button"
          onClick={() => handleCopy(subscriptionUrl, "Ссылка скопирована")}
        >
          <span className={styles.icon} aria-hidden="true">📋</span>
          <span>Скопировать ссылку</span>
        </button>
      </Card>

      <Toast
        open={toastOpen}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
