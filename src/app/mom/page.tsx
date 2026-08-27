import type { Metadata } from "next";
import { InvitationPage } from "@/components/sections/InvitationPage";

export const metadata: Metadata = {
  alternates: { canonical: "/mom" },
  openGraph: { url: "/mom" },
};

export default async function MomPage() {
  return <InvitationPage showAccounts showRsvp={false} sharePath="/mom" />;
}
