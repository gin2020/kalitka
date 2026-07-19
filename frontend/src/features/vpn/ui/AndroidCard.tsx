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
          <span className={styles.platformIcon} aria-hidden="true">◉</span>
          <span className={styles.title}>Инструкция для Android</span>
          <span className={styles.subtitle}>
            Установите приложение из Google Play и вставьте в него скопированную ссылку
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
            Установите любое приложение из Goole Play:
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
