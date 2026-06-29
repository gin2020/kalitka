"use client";

import { useState } from "react";

import { KalitkaLogo } from "@/components/brand/KalitkaLogo";
import { useCreateTrial } from "@/features/trial/hooks/useCreateTrial";
import { Dialog } from "@/shared/ui/Dialog/Dialog";
import { PrimaryAction } from "@/shared/ui/PrimaryAction";

import styles from "./LandingHero.module.css";

export function LandingHero() {
  const { loading, trial, error, startTrial } = useCreateTrial();

  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleCreateTrial() {
    await startTrial();
    setDialogOpen(true);
  }

  function copySubscription() {
    if (!trial) return;

    navigator.clipboard.writeText(trial.subscriptionUrl);
    alert("Подписка скопирована");
  }

  return (
    <>
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
              Получите доступ за пару нажатий.
              Kalitka сама подготовит VPN,
              а вы просто подключитесь.
            </p>
          </div>

          <div className={styles.panel}>
            <PrimaryAction
              onClick={handleCreateTrial}
              disabled={loading}
            >
              {loading
                ? "Создаем VPN..."
                : "Начать пользоваться"}
            </PrimaryAction>

            <a href="#" className={styles.accountLink}>
              Уже есть аккаунт?
            </a>
          </div>
        </div>
      </section>

      <Dialog
        isOpen={dialogOpen}
        title={trial ? "VPN готов" : "Ошибка"}
        cancelLabel="Закрыть"
        confirmLabel={trial ? "Скопировать" : undefined}
        onCancel={() => setDialogOpen(false)}
        onConfirm={trial ? copySubscription : undefined}
      >
        {trial ? (
          <>
            <strong>Германия 🇩🇪</strong>

            <br />
            <br />

            1 ГБ бесплатно

            <br />
            <br />

            <code
              style={{
                display: "block",
                wordBreak: "break-all",
                fontSize: 12,
              }}
            >
              {trial.subscriptionUrl}
            </code>
          </>
        ) : (
          error ?? "Не удалось создать VPN"
        )}
      </Dialog>
    </>
  );
}
