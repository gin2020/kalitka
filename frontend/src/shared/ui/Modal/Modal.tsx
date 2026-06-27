"use client";

import type { ReactNode } from "react";
import styles from "./Modal.module.css";

type ModalProps = Readonly<{
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}>;

export function Modal({ children, className, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const panelClasses = [styles.panel, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        aria-label={title}
        className={panelClasses}
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          {title ? <h2 className={styles.title}>{title}</h2> : <span />}
          <button className={styles.close} type="button" aria-label="Закрыть" onClick={onClose}>
            ×
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </section>
    </div>
  );
}
