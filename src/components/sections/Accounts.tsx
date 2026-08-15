import { wedding } from "@/content/wedding";
import { Accordion } from "@/components/interactive/Accordion";
import { CopyButton } from "@/components/interactive/CopyButton";
import { Reveal } from "@/components/interactive/Reveal";

const SIDE_LABEL = {
  groom: "신랑측",
  bride: "신부측",
} as const;

export function Accounts() {
  if (!wedding.accounts.enabled) {
    return null;
  }

  const groups = (["groom", "bride"] as const)
    .map((side) => ({
      side,
      items: wedding.accounts.items.filter((item) => item.side === side && item.number.trim()),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section className="section bg-canvas" aria-labelledby="accounts-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="accounts-title" className="section-title">
          마음을 전하실 곳
        </h2>
        {groups.length === 0 ? (
          <p className="text-ink-muted">계좌 정보는 아직 입력되지 않았습니다.</p>
        ) : (
          <div>
            {groups.map((group) => (
              <Accordion key={group.side} title={SIDE_LABEL[group.side]}>
                <ul className="grid gap-5">
                  {group.items.map((item) => (
                    <li key={`${item.bank}-${item.number}`}>
                      <p className="font-medium">
                        {item.bank} {item.number}
                      </p>
                      <p className="caption text-ink-muted">
                        {item.relation} {item.holder}
                      </p>
                      <CopyButton
                        className="mt-3"
                        value={`${item.bank} ${item.number}`}
                        label="계좌번호 복사"
                      />
                    </li>
                  ))}
                </ul>
              </Accordion>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
