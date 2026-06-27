import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalitka",
  description: "Простой VPN-сервис с бесплатным стартовым доступом на 1 ГБ.",
  applicationName: "Kalitka",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kalitka",
  },
  icons: {
    icon: "/kalitka-icon.svg",
    apple: "/kalitka-icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f7f8f6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>
        <main className="app-shell">{children}</main>
      </body>
    </html>
  );
}
