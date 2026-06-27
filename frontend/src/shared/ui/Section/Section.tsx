import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = Readonly<
  HTMLAttributes<HTMLElement> & {
    children: ReactNode;
    description?: string;
    eyebrow?: string;
    title?: string;
  }
>;

export function Section({
  children,
  className,
  description,
  eyebrow,
  title,
  ...props
}: SectionProps) {
  const classes = [styles.section, className ?? ""].filter(Boolean).join(" ");

  return (
    <section className={classes} {...props}>
      {(eyebrow || title || description) && (
        <header className={styles.header}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          {description ? <p className={styles.description}>{description}</p> : null}
        </header>
      )}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
