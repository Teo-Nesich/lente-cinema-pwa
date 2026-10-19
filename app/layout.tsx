import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lente — Dentro il cinema",
  description: "Regia, scenografia, fotografia e storie dal set.",
  icons: { icon: "/assets/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
