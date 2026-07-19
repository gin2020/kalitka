"use client";

import { useState } from "react";

import { Card } from "@/shared/ui/Card/Card";

import styles from "./PlatformCard.module.css";

const apps = [
  {
    name: "Shadowrocket",
    href: "https://apps.apple.com/ua/app/shadowrocket/id932747118",
  },
  {
    name: "Happ",
    href: "https://apps.apple.com/ua/app/happ-proxy-utility/id6504287215",
  },
  {
    name: "v2RayTun",
    href: "https://apps.apple.com/ua/app/v2raytun/id6476628951",
  },
  {
    name: "Streisand",
    href: "https://apps.apple.com/ua/app/streisand/id6450534064",
  },
  {
    name: "V2BOX",
    href: "https://apps.apple.com/ua/app/v2box-v2ray-client/id6446814690",
  },
  {
    name: "RabbitHole",
    href: "https://apps.apple.com/ua/app/rabbithole-vpn-client/id6683309629",
  },
  {
    name: "Hiddify",
    href: "https://apps.apple.com/ua/app/hiddify-proxy-vpn/id6596777532",
  },
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
