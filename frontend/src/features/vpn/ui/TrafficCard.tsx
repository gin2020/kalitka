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
  const [instructionsOpen, setInstructionsOpen] = useState(false);

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
            Подключите VPN
          </h2>

          <p className={styles.subtitle}>
            Начните со ссылки. Дальше приложение подскажет, что делать.
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

        <p className={styles.hint}>
          Затем выберите приложение ниже.
        </p>

        <button
          className={styles.instructionsTrigger}
          type="button"
          aria-expanded={instructionsOpen}
          onClick={() => setInstructionsOpen((value) => !value)}
        >
          <span aria-hidden="true">✦</span>
          <span>Как подключить VPN</span>
          <span className={styles.instructionsChevron} aria-hidden="true">
            {instructionsOpen ? "−" : "+"}
          </span>
        </button>

        <div
          className={styles.instructionsWrap}
          data-open={instructionsOpen}
        >
          <ol className={styles.steps}>
            <li><span>1</span>Скопируйте ссылку</li>
            <li><span>2</span>Откройте приложение ниже</li>
            <li><span>3</span>Вставьте ссылку</li>
            <li><span>4</span>Нажмите «Подключить»</li>
          </ol>
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
