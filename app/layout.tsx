import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next + Nest Demo",
  description: "Minimal Next frontend with a Nest-powered backend route"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
