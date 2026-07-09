import { apiFetch } from "./client";

export type MyVpnResponse = {
  active: boolean;
  status: string;
  country: string;
  protocol: string;
  trafficLimit: number;
  trafficUsed: number;
  subscriptionUrl: string;
  clientEmail: string;
  createdAt: string;
  expiresAt: string | null;
};

export function getMyVpn() {
  return apiFetch<MyVpnResponse>(
    "/subscription/me",
    {
      cache: "no-store",
    }
  );
}
