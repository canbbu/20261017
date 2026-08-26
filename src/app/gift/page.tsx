import type { Metadata } from "next";
import { InvitationPage } from "@/components/sections/InvitationPage";

export const metadata: Metadata = {
  alternates: { canonical: "/gift" },
  openGraph: { url: "/gift" },
};

export default async function GiftPage() {
  return <InvitationPage showAccounts />;
}
