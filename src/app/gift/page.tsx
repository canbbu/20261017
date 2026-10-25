import type { Metadata } from "next";
import { ThanksPage } from "@/components/sections/ThanksPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/gift" },
  openGraph: { url: "/gift" },
};

export default function GiftPage() {
  return <ThanksPage />;
}
