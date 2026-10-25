import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const LOTTERY_EDIT_COOKIE = "lottery_edit";
const SESSION_MESSAGE = "lottery-edit-v1";
const MIN_PASSWORD_LENGTH = 8;

export function editPassword(): string {
  return (process.env.LOTTERY_EDIT_PASSWORD ?? "").trim();
}

export function isEditPasswordConfigured(): boolean {
  return editPassword().length >= MIN_PASSWORD_LENGTH;
}

export function passwordsMatch(input: string, expected = editPassword()): boolean {
  if (expected.length < MIN_PASSWORD_LENGTH) {
    return false;
  }

  const actual = createHash("sha256").update(input).digest();
  const wanted = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actual, wanted);
}

export function editSessionToken(password = editPassword()): string {
  return createHmac("sha256", password).update(SESSION_MESSAGE).digest("base64url");
}

export function sessionMatches(cookie: string | undefined, password = editPassword()): boolean {
  if (!cookie || password.length < MIN_PASSWORD_LENGTH) {
    return false;
  }

  const expected = editSessionToken(password);
  const actual = Buffer.from(cookie);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length) {
    return false;
  }

  return timingSafeEqual(actual, wanted);
}

export async function hasEditSession(): Promise<boolean> {
  const jar = await cookies();
  return sessionMatches(jar.get(LOTTERY_EDIT_COOKIE)?.value);
}

export async function writeEditSession(): Promise<void> {
  const jar = await cookies();
  jar.set(LOTTERY_EDIT_COOKIE, editSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}
