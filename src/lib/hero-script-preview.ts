export const heroScriptPreviewIds = ["allura", "italianno", "brittany", "amsterdam"] as const;

export type HeroScriptPreviewId = (typeof heroScriptPreviewIds)[number];

export const heroScriptPreviews: Record<
  HeroScriptPreviewId,
  { label: string; note: string }
> = {
  allura: {
    label: "Allura",
    note: "전체적인 형태가 가장 가까움",
  },
  italianno: {
    label: "Italianno",
    note: "더 가늘고 길게 흐르는 느낌",
  },
  brittany: {
    label: "Brittany Signature",
    note: "유료 폰트지만 세련된 서명체에 가까움",
  },
  amsterdam: {
    label: "Amsterdam Four",
    note: "더 자연스러운 웨딩 캘리그래피 느낌",
  },
};

export function parseHeroScriptPreviewId(value: string | undefined): HeroScriptPreviewId {
  if (value && (heroScriptPreviewIds as readonly string[]).includes(value)) {
    return value as HeroScriptPreviewId;
  }

  return "allura";
}
