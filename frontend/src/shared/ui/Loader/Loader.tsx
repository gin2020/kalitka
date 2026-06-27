import type { HTMLAttributes } from "react";
import styles from "./Loader.module.css";

type LoaderSize = "sm" | "md" | "lg";

type LoaderProps = Readonly<
  HTMLAttributes<HTMLDivElement> & {
    centered?: boolean;
    label?: string;
    size?: LoaderSize;
  }
>;

export function Loader({ centered = false, className, label, size = "md", ...props }: LoaderProps) {
  const classes = [
    styles.loader,
    styles[size],
    centered ? styles.centered : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div aria-label={label ?? "Загрузка"} className={classes} role="status" {...props}>
      <span className={styles.spinner} aria-hidden="true" />
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
