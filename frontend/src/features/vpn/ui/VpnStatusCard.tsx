import { Card, Badge, ProgressBar } from "@/shared/ui";

import styles from "./VpnStatusCard.module.css";

type Props = {
  country: string;
  protocol: string;
  status: string;
};

export function VpnStatusCard({
  country,
  protocol,
}: Props) {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.dot} />

        <div>
          <h2 className={styles.title}>
            VPN активен
          </h2>

          <p className={styles.subtitle}>
            Соединение защищено
          </p>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <div className={styles.icon}>🇩🇪</div>

        <div>
          <div className={styles.value}>
            {country}
          </div>

          <div className={styles.label}>
            Страна
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.icon}>🔒</div>

        <div>
          <div className={styles.value}>
            {protocol}
          </div>

          <div className={styles.label}>
            Протокол
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.traffic}>
        Использовано трафика
      </div>

      <ProgressBar
        value={0}
        max={1024}
        valueLabel="0 МБ / 1 ГБ"
      />

      <div className={styles.badge}>
        <Badge>
          🎁 1 ГБ бесплатно
        </Badge>
      </div>
    </Card>
  );
}
