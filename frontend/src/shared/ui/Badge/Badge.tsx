import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

type BadgeProps = Readonly<
  HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
    tone?: BadgeTone;
  }
>;

export function Badge({ children, className, tone = "neutral", ...props }: BadgeProps) {
  const classes = [styles.badge, styles[tone], className ?? ""].filter(Boolean).join(" ");

  return (
    <span className={classes} {...props}>
      <span className={styles.content}>{children}</span>
    </span>
  );
}
