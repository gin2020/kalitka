"use client";

import { useState } from "react";

import { Card } from "@/shared/ui/Card/Card";

import styles from "./PlatformCard.module.css";

const apps = [
  {
    name: "Happ",
    href: "https://play.google.com/store/apps/details?id=com.happproxy",
  },
  {
    name: "v2RayTun",
    href: "https://play.google.com/store/apps/details?id=com.v2raytun.android",
  },
  {
    name: "V2BOX",
    href: "https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box",
  },
  {
    name: "Hiddify",
    href: "https://play.google.com/store/apps/details?id=app.hiddify.com",
  },
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
                key={app.name}
              >
                <a
                  className={styles.appLink}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
