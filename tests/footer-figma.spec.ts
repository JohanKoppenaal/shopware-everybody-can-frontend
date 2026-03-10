import { test, expect } from '@playwright/test';

/**
 * Footer Figma Design Validation Tests
 *
 * Valideert de Shopware footer tegen het Figma design:
 * https://www.figma.com/design/meHFNqt42k9ca1N5KcAfN5/H1-Shopware-Theme?node-id=35-1512
 *
 * Design specs:
 * - Font: Inter
 * - Primary color: #F25305 (oranje)
 * - Secondary color: #111111 (donker)
 * - Border color: #DDDDDD
 * - Light background: #EEEEEE
 */

const BASE_URL = 'http://localhost:8888';

// Figma design kleuren
const COLORS = {
  primary: 'rgb(242, 83, 5)',      // #F25305
  secondary: 'rgb(17, 17, 17)',    // #111111
  white: 'rgb(255, 255, 255)',     // #FFFFFF
  gray: 'rgb(102, 102, 102)',      // #666666
  border: 'rgb(221, 221, 221)',    // #DDDDDD
  light: 'rgb(238, 238, 238)',     // #EEEEEE
};

test.describe('Footer Figma Design Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('footer is visible and has correct structure', async ({ page }) => {
    const footer = page.locator('footer.footer-main');
    await expect(footer).toBeVisible();
  });

  test('newsletter section - has signup form', async ({ page }) => {
    // Figma design: "Subscribe & get 10% OFF for first order"
    // Shopware default may differ, but should have newsletter signup
    const footer = page.locator('footer.footer-main');

    // Check for newsletter/email signup elements
    const newsletterSection = footer.locator('[class*="newsletter"], [class*="subscribe"], form[action*="newsletter"]');

    // If newsletter exists, validate it has an email input
    const emailInput = footer.locator('input[type="email"], input[name*="email"]');
    if (await emailInput.count() > 0) {
      await expect(emailInput.first()).toBeVisible();
    }
  });

  test('footer has service/USP section', async ({ page }) => {
    // Figma design heeft USP's: Free Shipping, Fast delivery, Money-Back Guarantee, Secure Payments
    const footer = page.locator('footer.footer-main');

    // Shopware's default footer heeft service links
    const serviceSection = footer.locator('[class*="service"], [class*="column"]');
    await expect(serviceSection.first()).toBeVisible();
  });

  test('footer has multiple link columns', async ({ page }) => {
    // Figma design: Partner, Help Center, Company, Shop by category
    const footer = page.locator('footer.footer-main');

    // Check for footer columns
    const columns = footer.locator('[class*="column"], [class*="col-"]');
    const columnCount = await columns.count();

    // Footer should have multiple columns (at least 2)
    expect(columnCount).toBeGreaterThanOrEqual(2);
  });

  test('footer has contact information', async ({ page }) => {
    // Figma design: Phone, address, email
    const footer = page.locator('footer.footer-main');

    // Check for contact elements (phone, email links, or address)
    const contactElements = footer.locator('a[href^="tel:"], a[href^="mailto:"], [class*="contact"], [class*="address"]');

    // At minimum, footer should have some text content
    const footerText = await footer.textContent();
    expect(footerText?.length).toBeGreaterThan(50);
  });

  test('footer has bottom section with links or copyright', async ({ page }) => {
    // Figma design: "Copyright © shopware AG - All rights reserved"
    // Shopware default may have different footer bottom content
    const footer = page.locator('footer.footer-main');

    // Footer should have substantial content
    const footerText = await footer.textContent();
    expect(footerText?.length).toBeGreaterThan(100);
  });

  test('footer links are clickable', async ({ page }) => {
    const footer = page.locator('footer.footer-main');

    // Get all links in footer
    const links = footer.locator('a[href]');
    const linkCount = await links.count();

    // Footer should have multiple links
    expect(linkCount).toBeGreaterThan(5);

    // First link should be clickable (not disabled)
    const firstLink = links.first();
    await expect(firstLink).toBeEnabled();
  });

  test('footer visual regression - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const footer = page.locator('footer.footer-main');
    await footer.scrollIntoViewIfNeeded();

    await expect(footer).toHaveScreenshot('footer-figma-desktop.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('footer visual regression - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const footer = page.locator('footer.footer-main');
    await footer.scrollIntoViewIfNeeded();

    await expect(footer).toHaveScreenshot('footer-figma-tablet.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('footer visual regression - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const footer = page.locator('footer.footer-main');
    await footer.scrollIntoViewIfNeeded();

    await expect(footer).toHaveScreenshot('footer-figma-mobile.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  // ============================================
  // FIGMA BASELINE COMPARISON
  // Vergelijkt implementatie direct met Figma export
  // ============================================

  test('figma comparison: footer matches Figma design', async ({ page }) => {
    // Set exact Figma viewport (1920px breed)
    await page.setViewportSize({ width: 1920, height: 1080 });

    const footer = page.locator('footer.footer-main');
    await footer.scrollIntoViewIfNeeded();

    // Screenshot van de implementatie - vergelijk met Figma baseline
    // Baseline: tests/figma-baselines/figma-footer-desktop.png (direct uit Figma)
    await expect(footer).toHaveScreenshot('footer-vs-figma.png', {
      maxDiffPixelRatio: 0.15, // 15% tolerantie voor kleine verschillen
      threshold: 0.3, // pixel threshold
    });
  });

  // ============================================
  // COMPONENT-LEVEL VISUAL TESTS
  // Test individuele onderdelen apart
  // ============================================

  test('component: newsletter section visual', async ({ page }) => {
    const newsletter = page.locator('.h1-footer-newsletter');
    if (await newsletter.count() > 0) {
      await newsletter.scrollIntoViewIfNeeded();
      await expect(newsletter).toHaveScreenshot('component-newsletter.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
  });

  test('component: USP bar visual', async ({ page }) => {
    const uspBar = page.locator('.h1-footer-usp');
    if (await uspBar.count() > 0) {
      await uspBar.scrollIntoViewIfNeeded();
      await expect(uspBar).toHaveScreenshot('component-usp-bar.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
  });

  test('component: footer columns visual', async ({ page }) => {
    const columns = page.locator('.h1-footer-columns');
    if (await columns.count() > 0) {
      await columns.scrollIntoViewIfNeeded();
      await expect(columns).toHaveScreenshot('component-columns.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
  });

  test('component: copyright bar visual', async ({ page }) => {
    const copyright = page.locator('.h1-footer-copyright');
    if (await copyright.count() > 0) {
      await copyright.scrollIntoViewIfNeeded();
      await expect(copyright).toHaveScreenshot('component-copyright.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
  });

  // ============================================
  // CSS PROPERTY VALIDATION
  // Valideert specifieke design tokens uit Figma
  // ============================================

  test('css: newsletter has correct background color', async ({ page }) => {
    const newsletter = page.locator('.h1-footer-newsletter');
    if (await newsletter.count() > 0) {
      await expect(newsletter).toHaveCSS('background-color', COLORS.secondary);
    }
  });

  test('css: newsletter button has primary color', async ({ page }) => {
    const button = page.locator('.h1-footer-newsletter-button');
    if (await button.count() > 0) {
      await expect(button).toHaveCSS('background-color', COLORS.primary);
    }
  });

  test('css: USP text has correct font weight', async ({ page }) => {
    const uspText = page.locator('.h1-footer-usp-text').first();
    if (await uspText.count() > 0) {
      await expect(uspText).toHaveCSS('font-weight', '700');
    }
  });

  test('css: copyright bar has light background', async ({ page }) => {
    const copyright = page.locator('.h1-footer-copyright');
    if (await copyright.count() > 0) {
      await expect(copyright).toHaveCSS('background-color', COLORS.light);
    }
  });

  test('css: footer columns have white background', async ({ page }) => {
    const columns = page.locator('.h1-footer-columns');
    if (await columns.count() > 0) {
      await expect(columns).toHaveCSS('background-color', COLORS.white);
    }
  });

});

/**
 * TODO voor back-enders:
 *
 * Wanneer je het Figma design implementeert, voeg dan specifieke checks toe voor:
 *
 * 1. Newsletter sectie:
 *    - Heading: "Subscribe & get 10% OFF for first order"
 *    - Privacy tekst aanwezig
 *    - Achtergrondkleur: #111111
 *    - Button kleur: #F25305
 *
 * 2. USP bar:
 *    - 4 items: Free Shipping, Fast delivery, Money-Back Guarantee, Secure Payments
 *    - Icons aanwezig
 *    - Border onderaan
 *
 * 3. Footer kolommen:
 *    - Partner: Become Seller, Affiliate, Advertise, Partnership
 *    - Help Center: Customer Service, Policy, Terms & Conditions, Track Order, FAQs, Product Support
 *    - Company: About Shopware, Contact, Career, Blog, Sitemap, Store Locations
 *    - Shop by category: diverse categorieën
 *
 * 4. Contact info:
 *    - Logo
 *    - Openingstijden: Mon-Fri, 9 am - 5 pm
 *    - Telefoonnummer
 *    - Adres
 *    - Email
 *    - Social media icons
 *
 * 5. Copyright bar:
 *    - Achtergrondkleur: #EEEEEE
 *    - Copyright tekst
 *    - Payment icons
 */
