"use client";

import { useState } from "react";

import { Card } from "@/shared/ui/Card/Card";

import styles from "./PlatformCard.module.css";

const apps = [
  "Shadowrocket",
  "Happ",
  "v2RayTun",
  "Streisand",
  "V2BOX",
  "RabbitHole",
  "Hiddify",
];

export function IOSCard() {
  const [open, setOpen] = useState(false);

  return (
    <Card className={styles.card}>
      <button
        className={styles.trigger}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.content}>
          <span className={styles.platformIcon} aria-hidden="true">●</span>
          <span className={styles.title}>Инструкция для iPhone</span>
          <span className={styles.subtitle}>
            Установите приложение из App Store и вставьте в него скопированную ссылку
          </span>
        </span>

        <span
          className={styles.chevron}
          aria-hidden="true"
        >
          {open ? "-" : "+"}
        </span>
      </button>

      <div className={styles.panelWrap} data-open={open}>
        <div className={styles.panel}>
          <p className={styles.panelText}>
            Скачайте любое приложение из App Store:
          </p>

          <ul className={styles.appList}>
            {apps.map((app) => (
              <li
                className={styles.appItem}
                key={app}
              >
                {app}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
