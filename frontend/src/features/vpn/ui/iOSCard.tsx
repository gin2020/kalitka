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
          <span className={styles.title}>iOS</span>
          <span className={styles.subtitle}>
            Инструкция для подключения
          </span>
        </span>

        <span
          className={styles.chevron}
          aria-hidden="true"
        >
          {open ? "-" : "+"}
        </span>
      </button>

      {open && (
        <div className={styles.panel}>
          <p className={styles.panelText}>
            Скопированную подписку поддерживают:
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
      )}
    </Card>
  );
}
