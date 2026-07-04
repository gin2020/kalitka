"use client";

import { getMyVpn } from "@/shared/api/vpn";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { KalitkaLogo } from "@/components/brand/KalitkaLogo";

import { useCreateTrial } from "@/features/trial/hooks/useCreateTrial";
import { PrimaryAction } from "@/shared/ui/PrimaryAction";
import { Spinner } from "@/shared/ui/Spinner/Spinner";

import styles from "./LandingHero.module.css";

export function LandingHero() {
  const { loading, trial, error, startTrial } = useCreateTrial();

  const router = useRouter();

  useEffect(() => {
    async function checkSubscription() {
      try {
        const vpn = await getMyVpn();

        if (vpn.active) {
          router.replace("/my-vpn");
        }
      } catch {
        // Нет активной подписки — остаёмся на главной.
      } 
    }

    checkSubscription();
  }, [router]);

  async function handleCreateTrial() {
    try {
      await startTrial();

      router.push("/my-vpn");
    } catch (err) {
      console.error(err);
      alert("Не удалось создать VPN");
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
    </>
  );
}
