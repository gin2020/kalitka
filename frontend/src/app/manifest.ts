import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kalitka",
    short_name: "Kalitka",
    description: "Простой VPN-сервис с бесплатным стартовым доступом на 1 ГБ.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f8f6",
    theme_color: "#f7f8f6",
    icons: [
      {
        src: "/kalitka-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/kalitka-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
