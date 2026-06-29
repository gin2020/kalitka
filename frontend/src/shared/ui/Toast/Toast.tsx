"use client";

import { useEffect } from "react";
import styles from "./Toast.module.css";

type ToastProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
};

export function Toast({
  open,
  message,
  onClose,
  duration = 2500,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(onClose, duration);

    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className={styles.toast}>
      <span className={styles.icon}>✓</span>
      <span>{message}</span>
    </div>
  );
}
