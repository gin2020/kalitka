import { KalitkaLogo } from "@/components/brand/KalitkaLogo";
import { PrimaryAction } from "@/shared/ui/PrimaryAction";
import styles from "./LandingHero.module.css";

export function LandingHero() {
  return (
    <section className={styles.screen} aria-labelledby="landing-title">
      <div className={styles.content}>
        <header className={styles.header}>
          <KalitkaLogo />
        </header>

        <div className={styles.offer}>
          <p className={styles.badge}>Быстрый старт без настроек</p>
          <h1 id="landing-title" className={styles.title}>
            1 ГБ VPN бесплатно
          </h1>
          <p className={styles.description}>
            Получите доступ за пару нажатий. Kalitka сама подготовит VPN, а вы просто
            подключитесь и пользуйтесь интернетом свободнее.
          </p>
        </div>

        <div className={styles.panel}>
          <PrimaryAction href="#" aria-label="Начать пользоваться Kalitka">
            Начать пользоваться
          </PrimaryAction>
          <a href="#" className={styles.accountLink}>
            Уже есть аккаунт?
          </a>
        </div>
      </div>
    </section>
  );
}
