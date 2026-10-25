import type { Metadata } from "next";
import { ThanksPage } from "@/components/sections/ThanksPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/mom" },
  openGraph: { url: "/mom" },
};

export default function MomPage() {
  return <ThanksPage />;
}
