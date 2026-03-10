import { test, expect } from '@playwright/test';

/**
 * Footer Visual Regression Test
 *
 * Test voor back-enders om footer wijzigingen te valideren tegen Figma design
 */

const BASE_URL = 'http://localhost:8888';

test.describe('Footer Component Tests', () => {

  test('capture current footer - BEFORE changes', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll naar de footer
    const footer = page.locator('footer, .footer, [class*="footer"]').first();
    await footer.scrollIntoViewIfNeeded();

    // Screenshot van alleen de footer
    await expect(footer).toHaveScreenshot('footer-before.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('footer has required elements', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    const footer = page.locator('footer, .footer, [class*="footer"]').first();
    await expect(footer).toBeVisible();

    // Check basis footer elementen (pas aan naar Figma specs)
    // TODO: Voeg specifieke checks toe op basis van Figma design
  });

  test('footer responsive - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const footer = page.locator('footer, .footer, [class*="footer"]').first();
    await footer.scrollIntoViewIfNeeded();

    await expect(footer).toHaveScreenshot('footer-tablet.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('footer responsive - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const footer = page.locator('footer, .footer, [class*="footer"]').first();
    await footer.scrollIntoViewIfNeeded();

    await expect(footer).toHaveScreenshot('footer-mobile.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

});
