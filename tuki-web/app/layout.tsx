import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TUKI! STICKERS",
  description: "Catalogo, ventas, stock y escaneo para TUKI! STICKERS",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
