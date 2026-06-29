"use client";

import { useState } from "react";
import { createTrial, TrialResponse } from "@/shared/api/trial";

export function useCreateTrial() {
  const [loading, setLoading] = useState(false);
  const [trial, setTrial] = useState<TrialResponse["trial"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startTrial() {
    setLoading(true);
    setError(null);

    try {
      const result = await createTrial();
      setTrial(result.trial);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не удалось создать VPN");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    trial,
    error,
    startTrial,
  };
}
