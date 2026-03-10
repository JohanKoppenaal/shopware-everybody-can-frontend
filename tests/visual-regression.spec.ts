import { test, expect } from '@playwright/test';

/**
 * Visual Regression Test Suite
 *
 * Dit is een voorbeeld van hoe back-enders front-end tests kunnen draaien
 * om hun styling/layout wijzigingen te valideren.
 */

// Test tegen een publieke site (vervang door je eigen URL)
const TEST_URL = 'https://www.shopware.com';

test.describe('Visual Regression Tests', () => {

  test('homepage screenshot comparison', async ({ page }) => {
    await page.goto(TEST_URL);

    // Wacht tot de pagina volledig geladen is
    await page.waitForLoadState('networkidle');

    // Maak een screenshot en vergelijk met baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1, // 10% verschil toegestaan
    });
  });

  test('check page has correct structure', async ({ page }) => {
    await page.goto(TEST_URL);
    await page.waitForLoadState('domcontentloaded');

    // Check of basis elementen aanwezig zijn
    const header = page.locator('header, [class*="header"], nav');
    await expect(header.first()).toBeVisible();

    // Check dat de pagina content heeft
    const main = page.locator('main, [class*="content"], [class*="main"]');
    await expect(main.first()).toBeVisible();
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Zet viewport naar mobiel formaat
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto(TEST_URL);
    await page.waitForLoadState('networkidle');

    // Screenshot voor mobiele weergave
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

});

// Simpele test om te verfiieren dat alles werkt
test('basic navigation test', async ({ page }) => {
  await page.goto(TEST_URL);

  // Check dat de pagina succesvol laadt (geen 4xx/5xx errors)
  const response = await page.goto(TEST_URL);
  expect(response?.status()).toBeLessThan(400);

  // Check dat de title niet leeg is
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});
