import { expect, test } from "@playwright/test";

const lpPath = "/omJobmatch-lp";

test("FVの主要コピーとCTAが表示される", async ({ page }) => {
  await page.goto(lpPath);

  await expect(
    page.getByRole("heading", { name: /CAの求人選定を、\s*10分で提案できる\s*状態へ。/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "相談してみる" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "サービス資料を受け取る" }).first()).toBeVisible();
  await expect(page.locator(".video-shell")).toBeVisible();
});

test("FVのCTAからフォームへ移動し、意図が選択される", async ({ page }) => {
  await page.goto(lpPath);

  await page.locator(".hero-actions").getByRole("link", { name: "相談してみる" }).click();
  await expect(page.locator("#cta")).toBeInViewport();
  await expect(page.locator('input[name="intent"][value="consult"]')).toBeChecked();

  await page.locator(".hero-actions").getByRole("link", { name: "サービス資料を受け取る" }).click();
  await expect(page.locator('input[name="intent"][value="download"]')).toBeChecked();
});

test("機能カードの見出しと番号が表示される", async ({ page }) => {
  await page.goto(lpPath);

  await expect(page.locator(".feature-step", { hasText: "01" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /候補者情報を、\s*提案前に確認しやすく整理/ })).toBeVisible();
  await expect(page.locator(".feature-step", { hasText: "04" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /取込・確認作業を、\s*迷わず進められる状態へ/ })).toBeVisible();
});

test("フォームに入力できる", async ({ page }) => {
  await page.goto(`${lpPath}#cta`);

  await page.getByLabel("お名前").fill("山田 太郎");
  await page.getByLabel("会社名").fill("株式会社サンプル");
  await page.getByLabel("メールアドレス").fill("test@example.com");

  await expect(page.getByLabel("お名前")).toHaveValue("山田 太郎");
  await expect(page.getByLabel("会社名")).toHaveValue("株式会社サンプル");
  await expect(page.getByLabel("メールアドレス")).toHaveValue("test@example.com");
});
