"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { TrafficCard } from "./TrafficCard";
import { ActionsCard } from "./ActionsCard";
import { PurchaseCard } from "./PurchaseCard";
import { SupportCard } from "./SupportCard";

import {
  getMyVpn,
  type MyVpnResponse,
} from "@/shared/api/vpn";

import { VpnStatusCard } from "./VpnStatusCard";

export function MyVpnPage() {
  const [vpn, setVpn] =
    useState<MyVpnResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyVpn();

        setVpn(data);
      } catch {
        localStorage.removeItem("clientEmail");

        router.replace("/");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!vpn?.active) {
    return <p>VPN не найден.</p>;
  }

  return (
    <>
      <VpnStatusCard
        country={vpn.country}
        protocol={vpn.protocol}
        status={vpn.status}
      />
      <TrafficCard />

      <ActionsCard />

      <PurchaseCard />

      <SupportCard />
    </>
  );
}
