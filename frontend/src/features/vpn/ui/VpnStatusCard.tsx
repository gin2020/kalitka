import { Card } from "@/shared/ui/Card/Card";
import { ProgressBar } from "@/shared/ui/ProgressBar/ProgressBar";

import styles from "./VpnStatusCard.module.css";

type Props = {
  country: string;
  protocol: string;
  status: string;
  trafficUsed: number;
  trafficLimit: number;
};

function formatMb(bytes: number) {
  return Math.round(bytes / 1024 / 1024);
}

function formatGb(bytes: number) {
  return Math.round(bytes / 1024 / 1024 / 1024);
}

export function VpnStatusCard({
  country,
  protocol,
  trafficUsed,
  trafficLimit,
}: Props) {
  return (
    <Card
      className={styles.card}
      padding="spacious"
    >
      <div className={styles.hero}>
        <div className={styles.left}>
          <div className={styles.status}>
            <div className={styles.onlineDot} />

            <div>
              <h2 className={styles.title}>
                VPN активен
              </h2>

              <p className={styles.subtitle}>
                Соединение защищено
              </p>
            </div>
          </div>

          <div className={styles.separator} />

          <div className={styles.infoBlock}>
            <div className={styles.infoRow}>
              <div className={styles.icon}>
                🇩🇪
              </div>

              <div>
                <div className={styles.value}>
                  {country}
                </div>

                <div className={styles.label}>
                  Страна
                </div>
              </div>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.icon}>
                🔒
              </div>

              <div>
                <div className={styles.value}>
                  {protocol}
                </div>

                <div className={styles.label}>
                  Протокол
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.glow} />

          <div className={styles.shield}>
            🛡️
          </div>
        </div>
      </div>

      <div className={styles.separator} />

      <div className={styles.traffic}>
        <h3 className={styles.trafficTitle}>
          Использовано трафика
        </h3>

        <ProgressBar
          value={trafficUsed}
          max={trafficLimit}
        />

        <div className={styles.trafficNumbers}>
          <span>
            {formatMb(trafficUsed)} МБ
          </span>

          <span>
            из {formatGb(trafficLimit)} ГБ
          </span>
        </div>

        <div className={styles.badge}>
          🎁 1 ГБ бесплатно
        </div>
      </div>
    </Card>
  );
}
