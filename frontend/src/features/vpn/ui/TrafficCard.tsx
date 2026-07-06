"use client";

import { useState } from "react";

import { Card, Toast } from "@/shared/ui";

import styles from "./TrafficCard.module.css";

type Props = {
  configUrl?: string;
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

export function TrafficCard({
  configUrl,
  subscriptionUrl,
}: Props) {
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  const configurationUrl = configUrl ?? subscriptionUrl;

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
          <h2 className={styles.title}>
            Данные для подключения
          </h2>

          <p className={styles.subtitle}>
            Нажмите на нужный блок, чтобы скопировать ссылку.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.action}
            type="button"
            onClick={() =>
              handleCopy(subscriptionUrl, "Подписка скопирована")
            }
          >
            <span className={styles.icon}>📋</span>

            <span className={styles.content}>
              <span className={styles.actionTitle}>
                Скопировать подписку
              </span>

              <span className={styles.link}>
                {subscriptionUrl}
              </span>
            </span>
          </button>

          <button
            className={styles.action}
            type="button"
            onClick={() =>
              handleCopy(configurationUrl, "Конфигурация скопирована")
            }
          >
            <span className={styles.icon}>⚙</span>

            <span className={styles.content}>
              <span className={styles.actionTitle}>
                Скопировать конфигурацию
              </span>

              <span className={styles.link}>
                {configurationUrl}
              </span>
            </span>
          </button>
        </div>
      </Card>

      <Toast
        open={toastOpen}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
