"use client";

import { useState } from "react";

import { Card } from "@/shared/ui/Card/Card";

import styles from "./PlatformCard.module.css";

const apps = [
  "Happ",
  "v2RayTun",
  "V2BOX",
  "Hiddify",
  "v2rayNG",
];

export function AndroidCard() {
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
          <span className={styles.title}>Android</span>
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
