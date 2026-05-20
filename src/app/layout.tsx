import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "pdgogogo · 财经简报",
  description: "每日早午晚财经简报",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-white text-zinc-900">{children}</body>
    </html>
  );
}
