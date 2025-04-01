import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Daily Report App",
  description: "A simple daily report app for tracking salary and expenses",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
