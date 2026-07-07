import { Card, ProgressBar } from "@/shared/ui";

import styles from "./VpnStatusCard.module.css";

type Props = {
  status: string;
  trafficUsed: number;
  trafficLimit: number;
};

function formatTraffic(value: number) {
  if (value >= 1024) {
    return `${(value / 1024).toFixed(1)} ГБ`;
  }

  return `${Math.round(value)} МБ`;
}

export function VpnStatusCard({
  status,
  trafficUsed,
  trafficLimit,
}: Props) {
  const percent =
    trafficLimit === 0
      ? 0
      : Math.min((trafficUsed / trafficLimit) * 100, 100);

  const remainingTraffic = Math.max(trafficLimit - trafficUsed, 0);
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
              Осталось {formatTraffic(remainingTraffic)}
            </p>
          </div>

          <div className={styles.percent}>
            {Math.round(percent)}%
          </div>
        </div>

        <ProgressBar
          value={percent}
        />

        <div className={styles.numbers}>
          <span>
            {formatTraffic(trafficUsed)}
          </span>

          <span>
            из {formatTraffic(trafficLimit)}
          </span>
        </div>

        <div className={styles.badge}>
          🎁 1 ГБ бесплатно
        </div>
      </div>
    </Card>
  );
}
