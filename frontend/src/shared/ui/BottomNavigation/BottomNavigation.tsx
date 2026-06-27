import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./BottomNavigation.module.css";

export type BottomNavigationItem = Readonly<{
  href: string;
  icon?: ReactNode;
  id: string;
  isActive?: boolean;
  label: string;
}>;

type BottomNavigationProps = Readonly<{
  ariaLabel?: string;
  className?: string;
  items: readonly BottomNavigationItem[];
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;
}>;

export function BottomNavigation({
  ariaLabel = "Основная навигация",
  className,
  items,
  linkProps,
}: BottomNavigationProps) {
  const classes = [styles.nav, className ?? ""].filter(Boolean).join(" ");
  const columns = `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))`;

  return (
    <nav aria-label={ariaLabel} className={classes}>
      <ul className={styles.list} style={{ gridTemplateColumns: columns }}>
        {items.map((item) => (
          <li className={styles.item} key={item.id}>
            <a
              aria-current={item.isActive ? "page" : undefined}
              className={`${styles.link} ${item.isActive ? styles.active : ""}`}
              href={item.href}
              {...linkProps}
            >
              {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
