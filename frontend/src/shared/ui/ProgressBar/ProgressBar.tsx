import type { HTMLAttributes } from "react";
import styles from "./ProgressBar.module.css";

type ProgressBarProps = Readonly<
  HTMLAttributes<HTMLDivElement> & {
    label?: string;
    max?: number;
    value: number;
    valueLabel?: string;
  }
>;

export function ProgressBar({
  className,
  label,
  max = 100,
  value,
  valueLabel,
  ...props
}: ProgressBarProps) {
  const normalizedMax = Math.max(max, 1);
  const normalizedValue = Math.min(Math.max(value, 0), normalizedMax);
  const percent = Math.round((normalizedValue / normalizedMax) * 100);
  const classes = [styles.root, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {(label || valueLabel) && (
        <div className={styles.meta}>
          {label ? <span className={styles.label}>{label}</span> : <span />}
          <span className={styles.value}>{valueLabel ?? `${percent}%`}</span>
        </div>
      )}
      <div
        aria-label={label}
        aria-valuemax={normalizedMax}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className={styles.track}
        role="progressbar"
      >
        <div className={styles.bar} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
