import { apiFetch } from "./client";

export interface TrialResponse {
  success: boolean;
  trial: {
    subscriptionUrl: string;
    clientEmail: string;
    trafficLimit: string;
    country: string;
    protocol: string;
    protocols: string[];
    status: string;
    active: boolean;
    trafficUsed: number;
  };
}

export function createTrial() {
  return apiFetch<TrialResponse>("/trial", {
    method: "POST",
  });
}
