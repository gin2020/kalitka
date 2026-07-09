import { Card, ProgressBar } from "@/shared/ui";

import styles from "./VpnStatusCard.module.css";

type Props = {
  status: string;
  trafficUsed: number;
  trafficLimit: number;
};

const BYTES_IN_MB = 1024 * 1024;
const BYTES_IN_GB = 1024 * BYTES_IN_MB;

function formatTraffic(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 МБ";
  }

  if (bytes >= BYTES_IN_GB) {
    return `${(bytes / BYTES_IN_GB).toFixed(1)} ГБ`;
  }

  return `${Math.round(bytes / BYTES_IN_MB)} МБ`;
}

export function VpnStatusCard({
  status,
  trafficUsed,
  trafficLimit,
}: Props) {
  const usagePercent =
    trafficLimit === 0
      ? 0
      : Math.min((trafficUsed / trafficLimit) * 100, 100);

  const remainingTraffic = Math.max(trafficLimit - trafficUsed, 0);
  const remainingPercent =
    trafficLimit === 0
      ? 0
      : Math.max(100 - usagePercent, 0);
  const statusLabel =
    status.trim().length > 0 ? status : "Активен";

  return (
    <Card
      className={styles.card}
      padding="spacious"
    >
      <div className={styles.hero}>
        <div className={styles.left}>
          <div className={styles.status}>
            <span className={styles.dot} />

            <div>
              <div className={styles.eyebrow}>
                <span className={styles.statusPill}>
                  {statusLabel}
                </span>
              </div>

              <h2 className={styles.title}>
                VPN подписка готова
              </h2>
            </div>
          </div>

          <p className={styles.subtitle}>
            Доступ создан. Можно подключаться и пользоваться VPN.
          </p>
        </div>
      </div>

      <div className={styles.separator} />

      <div className={styles.traffic}>
        <div className={styles.trafficHeader}>
          <div>
            <h3 className={styles.trafficTitle}>
              Трафик
            </h3>

            <p className={styles.trafficSubtitle}>
              Осталось {formatTraffic(remainingTraffic)} (
              {Math.round(remainingPercent)}%)
            </p>
          </div>

          <div className={styles.percent}>
            {Math.round(usagePercent)}%
          </div>
        </div>

        <ProgressBar
          value={usagePercent}
        />

        <div className={styles.trafficStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Лимит</span>
            <strong>{formatTraffic(trafficLimit)}</strong>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>Использовано</span>
            <strong>{formatTraffic(trafficUsed)}</strong>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>Осталось</span>
            <strong>{formatTraffic(remainingTraffic)}</strong>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>Использование</span>
            <strong>{Math.round(usagePercent)}%</strong>
          </div>
        </div>

        <div className={styles.badge}>
          🎁 1 ГБ бесплатно
        </div>
      </div>
    </Card>
  );
}
