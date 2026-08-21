export type MapLink = {
  id: "google" | "naver" | "kakao" | "tmap";
  label: string;
  href: string;
};

const LABELS: Record<MapLink["id"], string> = {
  google: "지도 보기",
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
  google?: string;
  naver: string;
  kakao: string;
  tmap: string;
}): MapLink[] {
  return (Object.keys(LABELS) as MapLink["id"][])
    .map((id) => ({ id, label: LABELS[id], href: (links[id] ?? "").trim() }))
    .filter((link) => isHttpsUrl(link.href));
}

export function getAppMapLinks(links: {
  google?: string;
  naver: string;
  kakao: string;
  tmap: string;
}): MapLink[] {
  return getSafeMapLinks(links).filter((link) => link.id !== "google");
}
