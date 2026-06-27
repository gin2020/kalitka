import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./PrimaryAction.module.css";

type PrimaryActionProps = Readonly<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
  }
>;

export function PrimaryAction({ children, className, ...props }: PrimaryActionProps) {
  const classes = className ? `${styles.action} ${className}` : styles.action;

  return (
    <a className={classes} {...props}>
      {children}
    </a>
  );
}
