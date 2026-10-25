import type { Metadata } from "next";
import { EditGate } from "@/components/interactive/EditGate";
import { LotteryEditor } from "@/components/interactive/LotteryEditor";
import { TicketCheck } from "@/components/interactive/TicketCheck";
import { LotteryBoard } from "@/components/sections/LotteryBoard";
import { wedding } from "@/content/wedding";
import { emptyLotteryFields, fieldsFromResult } from "@/lib/lottery";
import { hasEditSession, isEditPasswordConfigured } from "@/lib/lottery-session";
import { isLotteryWriteConfigured, readLotteryResult } from "@/lib/lottery-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: wedding.thanks.editTitle,
  robots: { index: false, follow: false },
};

export default async function EditPage() {
  return (
    <main className="page-shell">
      <section className="section thanks-section">
        <h1 className="section-title thanks-title">{wedding.thanks.editTitle}</h1>
        <EditBody />
      </section>
    </main>
  );
}

async function EditBody() {
  if (!isEditPasswordConfigured()) {
    return <p className="lottery-status">{wedding.thanks.passwordMissing}</p>;
  }

  if (!(await hasEditSession())) {
    return <EditGate />;
  }

  const result = await readLotteryResult();

  return (
    <>
      {isLotteryWriteConfigured() ? null : <p className="lottery-status">{wedding.thanks.unconfigured}</p>}
      <LotteryEditor initial={result ? fieldsFromResult(result) : emptyLotteryFields()} />
      {result ? (
        <section className="lottery-preview" aria-label={wedding.thanks.previewLabel}>
          <h2 className="lottery-grade-title">{wedding.thanks.previewLabel}</h2>
          <LotteryBoard result={result} gradeLevel={3} />
          <TicketCheck result={result} />
        </section>
      ) : (
        <p className="lottery-status">{wedding.thanks.emptyEdit}</p>
      )}
    </>
  );
}
