import styles from "./KalitkaLogo.module.css";

export function KalitkaLogo() {
  return (
    <div className={styles.logo} aria-label="Kalitka">
      <span className={styles.mark} aria-hidden="true">
        K
      </span>
      <span className={styles.name}>Kalitka</span>
    </div>
  );
}
