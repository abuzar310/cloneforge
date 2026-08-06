import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wembi • Instant Digital Twin",
  description:
    "Wembi trasforma macchinari e asset IoT in Digital Twin intelligenti, con monitoraggio in tempo reale, controllo remoto e gestione avanzata degli impianti.",
  icons: {
    icon: "/images/wembi/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
