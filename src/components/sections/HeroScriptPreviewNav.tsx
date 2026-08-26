import Link from "next/link";
import {
  heroScriptPreviewIds,
  heroScriptPreviews,
  type HeroScriptPreviewId,
} from "@/lib/hero-script-preview";

export function HeroScriptPreviewNav({ current }: { current: HeroScriptPreviewId }) {
  return (
    <nav className="script-preview-nav" aria-label="영문 제목 서체">
      {heroScriptPreviewIds.map((id) => {
        const selected = id === current;

        return (
          <Link
            key={id}
            href={`/prototype?font=${id}`}
            scroll={false}
            className="script-preview-nav__item"
            aria-current={selected ? "page" : undefined}
          >
            {heroScriptPreviews[id].label}
          </Link>
        );
      })}
    </nav>
  );
}
