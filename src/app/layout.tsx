import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notebook — Next.js starter",
  description:
    "A small full-stack Next.js app used to validate the Cloud Agent development environment end to end.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
