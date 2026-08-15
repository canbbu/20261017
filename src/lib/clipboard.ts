export type ClipboardResult = { ok: true } | { ok: false; reason: "empty" | "denied" };

export async function copyText(value: string): Promise<ClipboardResult> {
  const text = value.trim();
  if (!text) {
    return { ok: false, reason: "empty" };
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { ok: true };
    }
  } catch {
    // Fall through to the selectable fallback path.
  }

  try {
    if (typeof document.execCommand !== "function") {
      return { ok: false, reason: "denied" };
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok ? { ok: true } : { ok: false, reason: "denied" };
  } catch {
    return { ok: false, reason: "denied" };
  }
}
