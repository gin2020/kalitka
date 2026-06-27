import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Input.module.css";

type InputProps = Readonly<
  Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    endIcon?: ReactNode;
    error?: string;
    helperText?: string;
    label?: string;
    startIcon?: ReactNode;
  }
>;

export function Input({
  className,
  endIcon,
  error,
  helperText,
  id,
  label,
  startIcon,
  ...props
}: InputProps) {
  const message = error ?? helperText;
  const describedBy = message && id ? `${id}-message` : undefined;
  const inputClasses = [
    styles.input,
    startIcon ? styles.withStart : "",
    endIcon ? styles.withEnd : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={styles.field} htmlFor={id}>
      {label || helperText ? (
        <span className={styles.labelRow}>
          {label ? <span className={styles.label}>{label}</span> : <span />}
          {helperText && !error ? <span className={styles.hint}>{helperText}</span> : null}
        </span>
      ) : null}
      <span className={styles.inputWrap}>
        {startIcon ? <span className={`${styles.icon} ${styles.startIcon}`}>{startIcon}</span> : null}
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={inputClasses}
          id={id}
          {...props}
        />
        {endIcon ? <span className={`${styles.icon} ${styles.endIcon}`}>{endIcon}</span> : null}
      </span>
      {message ? (
        <span className={`${styles.message} ${error ? styles.error : ""}`} id={describedBy}>
          {message}
        </span>
      ) : null}
    </label>
  );
}
