import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Стоп-лист",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Providers>
          <div className="mx-auto w-full max-w-page">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
