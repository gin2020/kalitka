"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyVpn();

        setVpn(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!vpn?.active) {
    return <p>VPN не найден.</p>;
  }

  return (
    <>
      <h1>🟢 Мой VPN</h1>

      <VpnStatusCard
        country={vpn.country}
        protocol={vpn.protocol}
        status={vpn.status}
      />
    </>
  );
}
