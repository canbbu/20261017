import Link from "next/link";

export function PrototypeSwitch({ current }: { current: "fonts" | "layers" }) {
  return (
    <nav className="prototype-switch" aria-label="히어로 시안">
      <Link href="/prototype" aria-current={current === "fonts" ? "page" : undefined}>
        서체
      </Link>
      <Link href="/prototype/layers" aria-current={current === "layers" ? "page" : undefined}>
        레이어
      </Link>
    </nav>
  );
}
