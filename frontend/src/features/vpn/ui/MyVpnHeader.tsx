import Image from "next/image";

import styles from "./MyVpnHeader.module.css";

export function MyVpnHeader() {
  return (
    <header className={styles.header}>
      <Image
        src="/kalitka-icon.svg"
        alt="Kalitka"
        width={64}
        height={64}
        priority
      />

      <div>
        <h1 className={styles.title}>
          Kalitka
        </h1>

        <p className={styles.subtitle}>
          Простой и быстрый VPN
        </p>
      </div>
    </header>
  );
}
