import { expect, test, type Page } from "@playwright/test";

const open = async (page: Page) => {
  await page.goto("/examples/");
  await page.waitForFunction(() => customElements.get("k-card-viewer") && customElements.get("k-footer-strip"));
};

const viewerState = (page: Page, id: string) =>
  page.$eval(`#${id}`, (el) => {
    const v = el as HTMLElement & { looping: boolean; frames: number };
    const card = el.querySelector(".k-cv__card")!;
    return { looping: v.looping, frames: v.frames, rx: v.style.getPropertyValue("--k-rx"), transform: getComputedStyle(card).transform };
  });

test("shows every section without horizontal scroll", async ({ page }) => {
  await open(page);
  await expect(page.locator("#matrix .k-btn").first()).toBeVisible();
  expect(await page.locator("#matrix .k-btn").count()).toBeGreaterThanOrEqual(30 + 5 + 2 + 15);
  await expect(page.locator(".k-display")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("compact accent buttons follow their own product row", async ({ page }) => {
  await open(page);
  const bg = (product: string) => page.locator(`[data-k-product="${product}"] .k-btn--compact`).evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(await bg("fancon")).toBe("rgb(239, 255, 66)");
  expect(await bg("floorpass")).toBe("rgb(199, 68, 22)");
  expect(await bg("kult")).toBe("rgb(200, 30, 47)");
});

test("footer strip renders in Bahasa and English", async ({ page }) => {
  await open(page);
  await expect(page.locator("#strip-id .k-footer-strip__line")).toHaveText("Bagian dari ekosistem Kultura");
  await expect(page.locator("#strip-en .k-footer-strip__line")).toHaveText("Part of the Kultura ecosystem");
  await expect(page.locator("#strip-id a")).toHaveCount(7);
  await expect(page.locator("#strip-id").getByRole("link", { name: "Kultura", exact: true })).toHaveCount(0);
  await expect(page.locator("#strip-id").getByRole("link", { name: "kioskultura.com", exact: true })).toHaveCount(1);
  await expect(page.locator("#strip-id .k-footer-strip__entity")).toHaveText("PT Kios Gemar Kreasi");
  const bg = await page.locator("#strip-id").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(238, 47, 66)");
});

for (const id of ["card", "slab"]) {
  test(`${id} tilts with the pointer and the loop stops on leave`, async ({ page }) => {
    await open(page);
    const box = (await page.locator(`#${id} .k-cv__stage`).boundingBox())!;
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    const b = (await page.locator(`#${id} .k-cv__stage`).boundingBox())!;
    expect(box.width).toBeGreaterThan(0);
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.move(b.x + b.width * 0.95, b.y + b.height * 0.05, { steps: 8 });
    await page.waitForTimeout(200);
    const over = await viewerState(page, id);
    expect(over.looping).toBe(true);
    expect(over.rx).not.toBe("0deg");
    expect(over.transform).not.toBe("none");

    await page.mouse.move(2, 2);
    await page.waitForTimeout(450);
    const left = await viewerState(page, id);
    expect(left.looping).toBe(false);
    expect(left.rx).toBe("0deg");
    await page.waitForTimeout(500);
    const later = await viewerState(page, id);
    expect(later.frames).toBe(left.frames);
  });
}

test("card flips on click and keyboard", async ({ page }) => {
  await open(page);
  const card = page.locator("#card");
  await expect(card).toHaveAttribute("aria-label", "Kartu contoh seri 01 (depan)");
  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(card).toHaveAttribute("aria-label", "Kartu contoh seri 01 (belakang)");
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "false");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("viewers stay flat, sheen hidden, flip is an instant swap", async ({ page }) => {
    await open(page);
    const b = (await page.locator("#card .k-cv__stage").boundingBox())!;
    await page.mouse.move(b.x + b.width * 0.9, b.y + b.height * 0.1, { steps: 5 });
    await page.waitForTimeout(150);
    const s = await viewerState(page, "card");
    expect(s.looping).toBe(false);
    expect(s.frames).toBe(0);
    expect(s.transform).toBe("none");
    expect(await page.locator("#card .k-cv__sheen").evaluate((el) => getComputedStyle(el).display)).toBe("none");
    await page.locator("#card").click();
    await expect(page.locator("#card .k-cv__face--back")).toBeVisible();
    await expect(page.locator("#card .k-cv__face--front")).toBeHidden();
  });

  test("reveal content is visible without animation", async ({ page }) => {
    await open(page);
    await expect(page.locator(".k-reveal")).toHaveCSS("opacity", "1");
  });
});
