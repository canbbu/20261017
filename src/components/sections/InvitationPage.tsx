import { BgmPlayer } from "@/components/interactive/BgmPlayer";
import { Accounts } from "@/components/sections/Accounts";
import { Contact } from "@/components/sections/Contact";
import { Family } from "@/components/sections/Family";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { PlaceBackdrop } from "@/components/sections/PlaceBackdrop";
import { Rsvp } from "@/components/sections/Rsvp";
import { ShareFooter } from "@/components/sections/ShareFooter";
import { Venue } from "@/components/sections/Venue";
import { WeddingCalendar } from "@/components/sections/WeddingCalendar";
import { wedding } from "@/content/wedding";
import { listPublicNotes } from "@/lib/public-notes";

export async function InvitationPage({ showAccounts = false }: { showAccounts?: boolean }) {
  const notes = wedding.rsvp.enabled ? await listPublicNotes() : [];

  return (
    <main>
      {wedding.music.enabled ? (
        <BgmPlayer
          src={wedding.music.src}
          title={wedding.music.title}
          playLabel={wedding.copy.musicPlay}
          pauseLabel={wedding.copy.musicPause}
        />
      ) : null}
      <Hero />
      <PlaceBackdrop>
        <Invitation />
        <Family />
        <WeddingCalendar />
        <Venue />
        <Gallery />
        <Contact />
        <Rsvp notes={notes} />
        {showAccounts || wedding.accounts.enabled ? <Accounts /> : null}
        <ShareFooter />
      </PlaceBackdrop>
    </main>
  );
}
