"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { KalitkaLogo } from "@/components/brand/KalitkaLogo";
import { TrialDialog } from "@/features/landing/ui/TrialDialog";
import { useCreateTrial } from "@/features/trial/hooks/useCreateTrial";
import { PrimaryAction } from "@/shared/ui/PrimaryAction";
import { Spinner } from "@/shared/ui/Spinner/Spinner";

import styles from "./LandingHero.module.css";

export function LandingHero() {
  const { loading, trial, error, startTrial } = useCreateTrial();

  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  async function handleCreateTrial() {
    try {
      const trial = await startTrial();

      localStorage.setItem(
        "clientEmail",
        trial.clientEmail
      );

      router.push("/my-vpn");
    } catch (err) {
      console.error(err);
      setDialogOpen(true);
    }
  }

  return (
    <>
      <section className={styles.screen} aria-labelledby="landing-title">
        <div className={styles.content}>
          <header className={styles.header}>
            <KalitkaLogo />
          </header>

          <div className={styles.offer}>
            <p className={styles.badge}>
              Быстрый старт без настроек
            </p>

            <h1
              id="landing-title"
              className={styles.title}
            >
              1 ГБ VPN бесплатно
            </h1>

            <p className={styles.description}>
              Получите VPN за пару нажатий.
              Kalitka автоматически подготовит
              подписку для Happ.
            </p>
          </div>

          <div className={styles.panel}>
            <PrimaryAction
              onClick={handleCreateTrial}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  Создаем VPN...
                </>
              ) : (
                "Начать пользоваться"
              )}
            </PrimaryAction>

            <a
              href="#"
              className={styles.accountLink}
            >
              Уже есть аккаунт?
            </a>
          </div>
        </div>
      </section>

      {trial && (
        <TrialDialog
          isOpen={dialogOpen}
          subscriptionUrl={trial.subscriptionUrl}
          onClose={() => setDialogOpen(false)}
        />
      )}

      {!trial && dialogOpen && error && (
        <TrialDialog
          isOpen={dialogOpen}
          subscriptionUrl=""
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}
