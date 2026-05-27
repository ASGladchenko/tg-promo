import type { Metadata } from "next";
import Script from "next/script";
import "./globals.scss";

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
      <body>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
