import type { Metadata } from "next";
import { InvitationPage } from "@/components/sections/InvitationPage";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default async function HomePage() {
  return <InvitationPage />;
}
