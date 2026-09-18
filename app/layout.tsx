import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Стоп-лист",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-background font-sans text-foreground">
        <div className="mx-auto w-full max-w-page">{children}</div>
      </body>
    </html>
  );
}
