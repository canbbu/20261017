import { Accounts } from "@/components/sections/Accounts";
import { Contact } from "@/components/sections/Contact";
import { Family } from "@/components/sections/Family";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { ShareFooter } from "@/components/sections/ShareFooter";
import { Venue } from "@/components/sections/Venue";
import { WeddingCalendar } from "@/components/sections/WeddingCalendar";

export function InvitationPage({ showAccounts = false }: { showAccounts?: boolean }) {
  return (
    <main>
      <Hero />
      <Invitation />
      <Family />
      <WeddingCalendar />
      <Venue />
      <Gallery />
      <Contact />
      {showAccounts ? <Accounts /> : null}
      <ShareFooter />
    </main>
  );
}
