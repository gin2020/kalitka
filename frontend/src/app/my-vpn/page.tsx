"use client";

import { useEffect, useState } from "react";

type Subscription = {
  active: boolean;
  status: string;
  country: string;
  protocol: string;
  trafficLimit: number;
  trafficUsed: number;
  subscriptionUrl: string;
  clientEmail: string;
};

export default function MyVpnPage() {
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.kalitka.jesarion.com/api/v1/subscription/me",
      {
        credentials: "include",
      }
    )
      .then((r) => r.json())
      .then((data) => {
        setSubscription(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        Загрузка...
      </main>
    );
  }

  if (!subscription?.active) {
    return (
      <main style={{ padding: 24 }}>
        VPN не найден
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 24,
      }}
    >
      <h1>🟢 Моя VPN</h1>

      <p>
        <b>Страна:</b> {subscription.country}
      </p>

      <p>
        <b>Протокол:</b> {subscription.protocol}
      </p>

      <p>
        <b>Статус:</b> {subscription.status}
      </p>

      <p>
        <b>E-mail:</b> {subscription.clientEmail}
      </p>
    </main>
  );
}
