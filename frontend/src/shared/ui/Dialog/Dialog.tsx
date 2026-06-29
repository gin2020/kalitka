"use client";

import type { ReactNode } from "react";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import styles from "./Dialog.module.css";

type DialogTone = "default" | "danger";

type DialogProps = Readonly<{
  cancelLabel?: string;
  children?: ReactNode;
  confirmLabel?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  title: string;
  tone?: DialogTone;
}>;

export function Dialog({
  cancelLabel = "Отмена",
  children,
  confirmLabel = "Готово",
  isOpen,
  onCancel,
  onConfirm,
  title,
  tone = "default",
}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className={styles.content}>
        {children ? (
          <div className={styles.description}>
            {children}
          </div>
        ) : null}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          {onConfirm ? (
            <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
