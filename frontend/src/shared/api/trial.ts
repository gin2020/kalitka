import { apiFetch } from "./client";

export interface TrialResponse {
  success: boolean;
  trial: {
    subscriptionUrl: string;
    trafficLimit: string;
    country: string;
    protocols: string[];
  };
}

export function createTrial() {
  return apiFetch<TrialResponse>("/trial", {
    method: "POST",
  });
}
