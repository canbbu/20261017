export function toDigits(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function toTelHref(phone: string): string | null {
  const digits = toDigits(phone);
  if (!digits) return null;
  return `tel:${digits}`;
}

export function toSmsHref(phone: string): string | null {
  const digits = toDigits(phone);
  if (!digits) return null;
  return `sms:${digits}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("010")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10 && digits.startsWith("02")) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone.trim();
}
