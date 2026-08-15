import { Accounts } from "@/components/sections/Accounts";
import { Contact } from "@/components/sections/Contact";
import { Family } from "@/components/sections/Family";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { Rsvp } from "@/components/sections/Rsvp";
import { ShareFooter } from "@/components/sections/ShareFooter";
import { Venue } from "@/components/sections/Venue";
import { WeddingCalendar } from "@/components/sections/WeddingCalendar";
import { wedding } from "@/content/wedding";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Invitation />
      <Family />
      <WeddingCalendar />
      <Venue />
      <Gallery />
      <Contact />
      {wedding.rsvp.enabled ? <Rsvp /> : null}
      {wedding.accounts.enabled ? <Accounts /> : null}
      <ShareFooter />
    </main>
  );
}
