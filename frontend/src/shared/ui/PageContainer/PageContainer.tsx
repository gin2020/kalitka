import type { HTMLAttributes, ReactNode } from "react";
import styles from "./PageContainer.module.css";

type PageContainerSize = "narrow" | "default" | "wide";

type PageContainerProps = Readonly<
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    size?: PageContainerSize;
    withBottomNavigation?: boolean;
  }
>;

export function PageContainer({
  children,
  className,
  size = "default",
  withBottomNavigation = false,
  ...props
}: PageContainerProps) {
  const classes = [
    styles.container,
    styles[size],
    withBottomNavigation ? styles.withBottomNavigation : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
