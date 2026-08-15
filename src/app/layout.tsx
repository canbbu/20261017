import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/interactive/ToastRegion";
import { buildMetadata } from "@/lib/metadata";
import "./globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
