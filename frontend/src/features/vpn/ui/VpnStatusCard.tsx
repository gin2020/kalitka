import { Card } from "@/shared/ui";
import { ProgressBar } from "@/shared/ui/ProgressBar/ProgressBar";

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
    <Card className={styles.card} padding="spacious">
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.status}>
            <span className={styles.statusIcon}>
              🟢
            </span>

            <div>
              <h2 className={styles.statusTitle}>
                VPN активен
              </h2>

              <div className={styles.statusSubtitle}>
                Соединение защищено
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.info}>
            <div>
              <div className={styles.rowTitle}>
                🌍 Страна
              </div>

              <div className={styles.rowValue}>
                {country}
              </div>
            </div>

            <div>
              <div className={styles.rowTitle}>
                🔒 Протокол
              </div>

              <div className={styles.rowValue}>
                {protocol}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.shield}>
          🛡️
        </div>
      </div>

      <div className={styles.divider} />

      <div>
        <div className={styles.trafficTitle}>
          Использовано трафика
        </div>

        <ProgressBar
          value={0}
          max={1024}
        />

        <div className={styles.trafficFooter}>
          <span>0 МБ</span>

          <span>из 1 ГБ</span>
        </div>

        <div className={styles.badge}>
          🎁 1 ГБ бесплатно
        </div>
      </div>
    </Card>
  );
}
