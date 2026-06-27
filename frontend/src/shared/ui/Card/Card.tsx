import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

type CardVariant = "default" | "soft" | "outlined";
type CardPadding = "compact" | "normal" | "spacious";

type CardProps = Readonly<
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    padding?: CardPadding;
    variant?: CardVariant;
  }
>;

export function Card({
  children,
  className,
  padding = "normal",
  variant = "default",
  ...props
}: CardProps) {
  const classes = [styles.card, styles[variant], styles[padding], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
