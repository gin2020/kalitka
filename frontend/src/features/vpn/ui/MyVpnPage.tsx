"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { TrafficCard } from "./TrafficCard";
import { AndroidCard } from "./AndroidCard";
import { IOSCard } from "./iOSCard";
import { SupportCard } from "./SupportCard";

import {
  getMyVpn,
  type MyVpnResponse,
} from "@/shared/api/vpn";

import { VpnStatusCard } from "./VpnStatusCard";
import { MyVpnHeader } from "./MyVpnHeader";

const TRAFFIC_REFRESH_INTERVAL_MS = 30_000;

export function MyVpnPage() {
  const [vpn, setVpn] =
    useState<MyVpnResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getMyVpn();

        if (ignore) {
          return;
        }

        setVpn(data);
      } catch {
        localStorage.removeItem("clientEmail");

        router.replace("/");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    const intervalId = window.setInterval(
      load,
      TRAFFIC_REFRESH_INTERVAL_MS
    );

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [router]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!vpn?.active) {
    return <p>VPN не найден.</p>;
  }

  return (
    <>
      <MyVpnHeader />
      <VpnStatusCard
        status={vpn.status}
        trafficUsed={vpn.trafficUsed}
        trafficLimit={vpn.trafficLimit}
      />
      <TrafficCard subscriptionUrl={vpn.subscriptionUrl} />

      <IOSCard />

      <AndroidCard />

      <SupportCard />
    </>
  );
}
