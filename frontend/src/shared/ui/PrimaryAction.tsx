import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import styles from "./PrimaryAction.module.css";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
  children: ReactNode;
};

type PrimaryActionProps = LinkProps | ButtonProps;

export function PrimaryAction(props: PrimaryActionProps) {
  if (typeof props.href === "string") {
    const {
      children,
      className,
      href,
      ...rest
    } = props as LinkProps;

    return (
      <a
        className={
          className
            ? `${styles.action} ${className}`
            : styles.action
        }
        href={href}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const {
    children,
    className,
    ...rest
  } = props as ButtonProps;

  return (
    <button
      className={
        className
          ? `${styles.action} ${className}`
          : styles.action
      }
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
}
