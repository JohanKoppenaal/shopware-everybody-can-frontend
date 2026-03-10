# Shopware Figma Component Implementation

Implement a Figma design component in Shopware 6 with Playwright visual regression testing.

## Usage
```
/shopware-figma <figma-url-or-component-name>
```

## Workflow

When this skill is invoked, follow these steps IN ORDER:

### Phase 1: Figma Analysis (DO NOT SKIP)

1. **Extract Figma data** using `mcp__figma__get_figma_data`:
   - Get the fileKey and nodeId from the Figma URL
   - Analyze the component structure
   - Extract design tokens (colors, fonts, spacing)

2. **Download ALL assets** using `mcp__figma__download_figma_images`:
   - Full component screenshot (save to `tests/figma-baselines/`)
   - ALL icons and images in the component
   - Save icons to `src/custom/plugins/H1Theme/src/Resources/app/storefront/src/assets/icons/`

3. **Document design tokens**:
   ```scss
   // Extract and note these values:
   $primary: #F25305;    // From Figma
   $secondary: #111111;  // From Figma
   // etc.
   ```

### Phase 2: Playwright Test Setup

Create test file BEFORE implementing:

```typescript
// tests/[component]-figma.spec.ts
import { test, expect } from '@playwright/test';

test.describe('[Component] Figma Validation', () => {
  // 1. Structure test
  test('has correct structure', async ({ page }) => {
    // Validate HTML elements exist
  });

  // 2. Visual regression tests (desktop/tablet/mobile)
  test('visual regression - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    // Screenshot comparison
  });

  // 3. Figma comparison test
  test('matches Figma design', async ({ page }) => {
    // Compare against downloaded Figma baseline
  });

  // 4. CSS validation tests
  test('css: correct colors', async ({ page }) => {
    // Validate specific CSS properties
  });
});
```

### Phase 3: Implementation

**CRITICAL RULES:**

1. **Template Path**: Use correct Shopware path structure
   ```
   src/custom/plugins/[Theme]/src/Resources/views/storefront/
   └── layout/
       └── footer.html.twig   (NOT: layout/footer/footer.html.twig)
   ```

2. **Block Names**: Check PARENT template for exact block name
   ```twig
   {% sw_extends '@Storefront/storefront/layout/footer.html.twig' %}
   {% block base_footer %}  {# Verify this exists in parent! #}
   ```

3. **Dynamic Content**: NEVER hardcode CMS content
   ```twig
   {# WRONG: hardcoded columns #}
   <div><h4>Partner</h4><a>Link</a></div>

   {# RIGHT: include Shopware's dynamic content #}
   {% sw_include '@Storefront/storefront/layout/footer/footer.html.twig' %}
   ```

4. **CSS Selectors**: Style BOTH custom AND Shopware classes
   ```scss
   .h1-custom-wrapper {
     // Shopware generates these classes - style them!
     .footer-column { }
     .footer-headline { }
     .footer-link { }
   }
   ```

5. **Theme.json**: Include Storefront inheritance
   ```json
   {
     "style": [
       "@Storefront",  // REQUIRED!
       "app/storefront/src/scss/base.scss"
     ]
   }
   ```

6. **Preserve Shopware JS functionality**: NEVER remove data-* attributes or JS classes
   ```twig
   {# WRONG: removes JS functionality #}
   <div class="h1-column"><h4>Title</h4></div>

   {# RIGHT: keeps Shopware JS working #}
   <div class="footer-column h1-column" data-collapse-trigger>
       <div class="footer-column-headline">Title</div>
   </div>
   ```

7. **Use Snippet System for ALL texts**: No hardcoded strings!
   ```twig
   {# WRONG #}
   <button>Subscribe</button>

   {# RIGHT #}
   <button>{{ 'h1Theme.newsletter.button'|trans|sw_sanitize }}</button>
   ```

8. **Payment Icons are DYNAMIC**: Never hardcode payment methods
   ```twig
   {# WRONG: hardcoded SVGs #}
   <svg><!-- Visa --></svg>

   {# RIGHT: dynamic from Shopware #}
   {% sw_include '@Storefront/storefront/layout/footer/footer-payment-logos.html.twig' %}
   ```

9. **Icons via sw_include**: Not inline SVG in templates
   ```twig
   {# WRONG #}
   <svg width="24">...</svg>

   {# RIGHT #}
   {% sw_icon 'checkmark' %}
   {# or #}
   {% sw_include '@H1Theme/storefront/utilities/icon.html.twig' with {'name': 'shipping'} %}
   ```

10. **Figma Icons**: Download at DETAIL level (path, not frame)
    - Don't download the 24x24 frame → includes whitespace
    - Download the VECTOR/PATH node inside → exact shape only

### Phase 4: Validation Loop

```bash
# 1. Compile theme
docker compose exec shopware bin/console theme:compile

# 2. Run tests
npx playwright test [component]-figma.spec.ts

# 3. If test fails, check diff:
#    test-results/[test]/[name]-diff.png

# 4. Fix and repeat until tests pass
```

## Error Prevention Checklist

Before marking complete, verify:
- [ ] All icons downloaded from Figma (not hand-drawn)
- [ ] Icons downloaded at DETAIL level (path, not frame with whitespace)
- [ ] Figma screenshot saved as test baseline
- [ ] Template uses `sw_extends` (not full override)
- [ ] Block name matches parent template exactly
- [ ] Dynamic content uses `sw_include`
- [ ] CSS styles Shopware's generated classes
- [ ] `@Storefront` in theme.json style array
- [ ] **Shopware JS classes preserved** (data-*, collapse, toggle)
- [ ] **ALL texts via snippet system** (no hardcoded strings)
- [ ] **Payment icons dynamic** (not hardcoded SVGs)
- [ ] **Icons via sw_include** (not inline SVG)
- [ ] All Playwright tests pass
- [ ] Diff images reviewed and approved
- [ ] **Mobile tested** (collapse/expand works)

## Common Mistakes Reference

| Mistake | Fix |
|---------|-----|
| Icons don't match Figma | Download from Figma MCP, don't draw |
| Template doesn't load | Check block name in parent template |
| Styling doesn't apply | Add `@Storefront` to theme.json |
| Content disappeared | Use `sw_include` for dynamic content |
| CSS doesn't work | Style `.footer-column` not `.h1-column` |
| Tests keep failing | Use Figma export as baseline |
| Dimensions wrong | Compare pixel-by-pixel with Figma screenshot |
| **Mobile menu broken** | Preserve `data-*` attributes and JS classes |
| **No translations** | Use snippet system with `\|trans` filter |
| **Payment icons not editable** | Use dynamic `sw_include` not hardcoded SVG |
| **Icons not reusable** | Create icon component, use `sw_include` |
| **Icons have padding** | Download vector PATH in Figma, not parent frame |
