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
  if ("href" in props) {
    const { children, className, href, ...rest } = props;

    const classes = className
      ? `${styles.action} ${className}`
      : styles.action;

    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  const { children, className, ...rest } = props;

  const classes = className
    ? `${styles.action} ${className}`
    : styles.action;

  return (
    <button className={classes} type="button" {...rest}>
      {children}
    </button>
  );
}
