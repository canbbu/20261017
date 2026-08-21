import { expect, test } from "@playwright/test";
import path from "node:path";

const screenshotDir = path.join(process.cwd(), "docs", "screenshots");

test.describe("mobile wedding invitation", () => {
  test("shows the story without fabricated RSVP success", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1.hero-title")).toBeVisible();
    const music = page.getByRole("button", { name: /배경음악/ });
    await expect(music).toBeVisible();
    const musicBox = await music.boundingBox();
    expect(musicBox).not.toBeNull();
    expect((musicBox?.width ?? 0) >= 44).toBeTruthy();
    expect((musicBox?.height ?? 0) >= 44).toBeTruthy();
    await expect(page.getByRole("heading", { name: "두 사람" })).toBeVisible();
    await expect(page.getByText("이준명 · 최란옥의 아들")).toBeVisible();
    await expect(page.getByText("김재동의 딸")).toBeVisible();
    const calendarTitle = page.locator("#calendar-title");
    await calendarTitle.scrollIntoViewIfNeeded();
    await expect(calendarTitle).toBeVisible();
    await expect(page.locator("[aria-current='date']")).toHaveText("17");
    const venuePhoto = page.getByRole("img", { name: "셀레네하우스웨딩 천안점 예식홀. 유리창 앞 꽃 아치와 라탄 조명이 보인다" });
    await venuePhoto.scrollIntoViewIfNeeded();
    await expect(venuePhoto).toBeVisible();
    await expect.poll(async () => {
      return venuePhoto.evaluate((node) => (node as HTMLImageElement).naturalWidth);
    }).toBeGreaterThan(0);
    const venueBox = await venuePhoto.boundingBox();
    const venueRatio = await venuePhoto.evaluate((node) => {
      const image = node as HTMLImageElement;
      return image.naturalWidth / image.naturalHeight;
    });
    expect(venueBox).not.toBeNull();
    expect(Math.abs(venueRatio - venueBox!.width / venueBox!.height)).toBeLessThan(0.04);
    await expect(page.getByRole("link", { name: "네이버지도에서 셀레네하우스웨딩 열기" })).toBeVisible();
    await expect(page.getByRole("link", { name: "카카오맵에서 셀레네하우스웨딩 열기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "주소 복사" })).toBeVisible();
    await expect(page.getByRole("link", { name: "셀레네하우스웨딩에 전화하기" })).toBeVisible();
    await expect(page.getByRole("link", { name: "셀레네하우스웨딩 지도 보기" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "셀레네하우스웨딩 길찾기" })).toHaveCount(0);
    const gift = page.getByRole("heading", { name: "마음을 전하실 곳" });
    await gift.scrollIntoViewIfNeeded();
    await expect(gift).toBeVisible();
    const rsvpTitle = page.getByRole("heading", { name: "참석 의사" });
    await rsvpTitle.scrollIntoViewIfNeeded();
    await expect(rsvpTitle).toBeVisible();
    await expect(page.getByText("접수되었습니다")).toHaveCount(0);
    await expect(page.getByText("참석 의사를 전달했습니다.")).toHaveCount(0);
  });

  test("shows the gift page account row without inventing numbers", async ({ page }) => {
    await page.goto("/gift");
    await expect(page.getByText("이준명 · 최란옥의 아들")).toBeVisible();
    await expect(page.getByText("김재동의 딸")).toBeVisible();
    const gift = page.getByRole("heading", { name: "마음을 전하실 곳" });
    await gift.scrollIntoViewIfNeeded();
    await expect(gift).toBeVisible();
    await page.getByRole("button", { name: "마음을 전하실 곳" }).click();
    await page.getByRole("button", { name: "신랑측" }).click();
    await expect(page.getByText("부 이준명")).toBeVisible();
    await expect(page.getByText("농협 483034-52-014970")).toBeVisible();
    await expect(page.getByText("모 최란옥")).toBeVisible();
    await expect(page.getByText("농협 483034-56-218232")).toBeVisible();
    await expect(page.getByText("계좌 정보는 아직 입력되지 않았습니다.")).toHaveCount(0);
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

  test("toggles background music from the floating control", async ({ page }) => {
    await page.goto("/");
    const music = page.getByRole("button", { name: /배경음악/ });
    await expect(music).toBeVisible();
    const before = await music.getAttribute("aria-label");
    await music.click();
    await expect(music).not.toHaveAttribute("aria-label", before ?? "");
  });

  test("disables automatic motion when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.locator("section[aria-label='청첩장 첫 화면'] img");
    const title = page.locator("h1.hero-title");
    await expect(hero).toBeVisible();
    await expect(title).toBeVisible();
    const transform = await hero.evaluate((node) => getComputedStyle(node).transform);
    const opacity = await title.evaluate((node) => getComputedStyle(node).opacity);
    expect(transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)").toBeTruthy();
    expect(opacity).toBe("1");
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
