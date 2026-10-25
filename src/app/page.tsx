import type { Metadata } from "next";
import { ThanksPage } from "@/components/sections/ThanksPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function HomePage() {
  return <ThanksPage />;
}
