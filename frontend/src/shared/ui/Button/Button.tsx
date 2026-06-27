import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    endIcon?: ReactNode;
    fullWidth?: boolean;
    size?: ButtonSize;
    startIcon?: ReactNode;
    variant?: ButtonVariant;
  }
>;

export function Button({
  children,
  className,
  endIcon,
  fullWidth = true,
  size = "md",
  startIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {startIcon ? <span className={styles.icon}>{startIcon}</span> : null}
      <span className={styles.content}>{children}</span>
      {endIcon ? <span className={styles.icon}>{endIcon}</span> : null}
    </button>
  );
}
