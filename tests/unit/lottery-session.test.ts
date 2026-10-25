import { describe, expect, it } from "vitest";
import { passwordsMatch, sessionMatches, editSessionToken } from "@/lib/lottery-session";

const password = "open-sesame";

describe("lottery edit session", () => {
  it("accepts only the same password and the token made from it", () => {
    expect(passwordsMatch(password, password)).toBe(true);
    expect(passwordsMatch("wrong-password", password)).toBe(false);
    expect(passwordsMatch("", password)).toBe(false);
    expect(sessionMatches(editSessionToken(password), password)).toBe(true);
    expect(sessionMatches("not-the-token", password)).toBe(false);
    expect(sessionMatches(undefined, password)).toBe(false);
  });
});
