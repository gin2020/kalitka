"use client";

import { useEffect, useState } from "react";

import {
  getMyVpn,
  type MyVpnResponse,
} from "@/shared/api/vpn";

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
      <h1>🟢 Моя VPN</h1>

      <p>
        <strong>Страна:</strong> {vpn.country}
      </p>

      <p>
        <strong>Протокол:</strong> {vpn.protocol}
      </p>

      <p>
        <strong>Статус:</strong> {vpn.status}
      </p>
    </>
  );
}
