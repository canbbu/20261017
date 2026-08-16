import { expect, test } from "@playwright/test";
import path from "node:path";

const screenshotDir = path.join(process.cwd(), "docs", "screenshots");

test.describe("mobile wedding invitation", () => {
  test("shows the story without fabricated RSVP success", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1.hero-title")).toBeVisible();
    await expect(page.getByRole("heading", { name: "두 사람" })).toBeVisible();
    const calendarTitle = page.locator("#calendar-title");
    await calendarTitle.scrollIntoViewIfNeeded();
    await expect(calendarTitle).toBeVisible();
    await expect(page.locator("[aria-current='date']")).toHaveText("17");
    await expect(page.getByRole("heading", { name: "마음을 전하실 곳" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "참석 의사" })).toHaveCount(0);
    await expect(page.getByText("접수되었습니다")).toHaveCount(0);
  });

  test("shows the gift page account row without inventing numbers", async ({ page }) => {
    await page.goto("/gift");
    const gift = page.getByRole("heading", { name: "마음을 전하실 곳" });
    await gift.scrollIntoViewIfNeeded();
    await expect(gift).toBeVisible();
    await page.getByRole("button", { name: "마음을 전하실 곳" }).click();
    await expect(page.getByText("계좌 정보는 아직 입력되지 않았습니다.")).toBeVisible();
  });

  test("keeps hero title over the photograph", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const photo = page.locator("section[aria-label='청첩장 첫 화면'] img");
    const title = page.locator("h1.hero-title");
    await expect(photo).toBeVisible();
    const photoBox = await photo.boundingBox();
    const titleBox = await title.boundingBox();
    expect(photoBox).not.toBeNull();
    expect(titleBox).not.toBeNull();
    expect(titleBox!.y).toBeGreaterThanOrEqual(photoBox!.y);
    expect(titleBox!.y + titleBox!.height).toBeLessThanOrEqual(photoBox!.y + photoBox!.height);
  });

  test("opens the lightbox, supports keyboard, and restores focus", async ({ page }) => {
    await page.goto("/");
    const firstPhoto = page.getByRole("button", { name: /크게 보기/ }).first();
    await firstPhoto.scrollIntoViewIfNeeded();
    await firstPhoto.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/^1 \/ \d+$/)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText(/^2 \/ \d+$/)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(firstPhoto).toBeFocused();
  });

  test("copies the invitation URL when share is unsupported", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "초대장 공유" }).click();
    await expect(page.getByText("초대장 주소를 복사했습니다.")).toBeVisible();
  });

  test("disables automatic motion when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.locator("section[aria-label='청첩장 첫 화면'] img");
    await expect(hero).toBeVisible();
    const transform = await hero.evaluate((node) => getComputedStyle(node).transform);
    expect(transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)").toBeTruthy();
  });

  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 320, height: 568 },
  ]) {
    test(`captures ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.locator("section[aria-label='청첩장 첫 화면'] img").waitFor();
      await page.screenshot({
        path: path.join(screenshotDir, `hero-${viewport.width}x${viewport.height}.png`),
        fullPage: false,
        animations: "disabled",
      });
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let last = 0;
          const step = () => {
            window.scrollBy(0, 400);
            if (window.scrollY === last || window.innerHeight + window.scrollY >= document.body.scrollHeight) {
              window.scrollTo(0, 0);
              resolve();
              return;
            }
            last = window.scrollY;
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(screenshotDir, `page-${viewport.width}x${viewport.height}.png`),
        fullPage: true,
        animations: "disabled",
      });
      if (viewport.width === 320) {
        const share = page.getByRole("button", { name: "초대장 공유" });
        await share.scrollIntoViewIfNeeded();
        const box = await share.boundingBox();
        expect(box).not.toBeNull();
        expect((box?.height ?? 0) >= 44).toBeTruthy();
      }
    });
  }
});
