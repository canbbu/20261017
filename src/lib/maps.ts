export type MapLink = {
  id: "naver" | "kakao" | "tmap";
  label: string;
  href: string;
};

const LABELS: Record<MapLink["id"], string> = {
  naver: "네이버지도",
  kakao: "카카오맵",
  tmap: "티맵",
};

export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getSafeMapLinks(links: {
  naver: string;
  kakao: string;
  tmap: string;
}): MapLink[] {
  return (Object.keys(LABELS) as MapLink["id"][])
    .map((id) => ({ id, label: LABELS[id], href: links[id].trim() }))
    .filter((link) => isHttpsUrl(link.href));
}
