# Shopware Figma-to-Frontend Skill

## Doel
Deze skill helpt bij het implementeren van Figma designs in Shopware 6 themes, met Playwright visual regression testing als validatie. Ontworpen voor backend developers die frontend taken uitvoeren.

---

## KRITIEKE REGELS

### 1. Figma Assets ALTIJD Eerst Ophalen

**VOORDAT je begint met coderen:**

```
1. Gebruik Figma MCP om design te analyseren:
   - mcp__figma__get_figma_data voor structuur en design tokens
   - mcp__figma__download_figma_images voor ALLE afbeeldingen/icons

2. Download ALTIJD:
   - Volledige component screenshot als baseline (voor Playwright)
   - Alle icons/afbeeldingen uit het design
   - Noteer design tokens (kleuren, fonts, spacing)
```

**FOUT die we maakten:** Icons zelf tekenen i.p.v. uit Figma halen. Dit kostte extra iteraties.

### 2. Shopware Template Inheritance

**Correcte pad structuur:**
```
src/custom/plugins/[ThemeName]/src/Resources/views/storefront/
├── layout/
│   └── footer.html.twig          # NIET: layout/footer/footer.html.twig
├── page/
│   └── product-detail/
│       └── index.html.twig
```

**Correcte block override:**
```twig
{# GOED - extend parent template #}
{% sw_extends '@Storefront/storefront/layout/footer.html.twig' %}

{# GOED - override het juiste block #}
{% block base_footer %}
    {# custom content #}
{% endblock %}

{# FOUT - verkeerde block naam #}
{% block layout_footer %}  {# Dit bestaat niet! #}
```

**FOUT die we maakten:** Verkeerde block naam (`layout_footer` i.p.v. `base_footer`) waardoor template niet laadde.

### 3. NOOIT Dynamische Content Hardcoden

**FOUT:**
```twig
{# FOUT - hardcoded kolommen #}
<div class="h1-footer-column">
    <h4>Partner</h4>
    <a href="#">Become Seller</a>
    <a href="#">Affiliate</a>
</div>
```

**GOED:**
```twig
{# GOED - include Shopware's dynamische content #}
<div class="h1-footer-columns">
    {% sw_include '@Storefront/storefront/layout/footer/footer.html.twig' %}
</div>
```

**Regel:** Figma toont voorbeeldcontent. De STRUCTUUR en STYLING implementeer je, maar de CONTENT komt uit Shopware CMS.

### 4. CSS: Style Shopware Classes, Niet Alleen Custom Classes

**FOUT:**
```scss
// FOUT - alleen custom classes
.h1-footer-column {
    // styling...
}
```

**GOED:**
```scss
// GOED - style BEIDE custom EN Shopware classes
.h1-footer-columns {
    // Wrapper styling

    // Shopware's bestaande classes
    .footer-column {
        // styling die Shopware content matcht met Figma
    }

    .footer-headline,
    .footer-column-headline {
        // headline styling
    }

    .footer-link {
        // link styling
    }
}
```

**FOUT die we maakten:** CSS targetde `.h1-footer-column` maar Shopware genereert `.footer-column`.

### 5. Theme.json: Storefront Inheritance

**VERPLICHT in theme.json:**
```json
{
    "name": "ThemeName",
    "author": "Author",
    "views": [
        "@Storefront",
        "@Plugins",
        "@ThemeName"
    ],
    "style": [
        "@Storefront",           // <-- KRITIEK: zonder dit geen basis styling!
        "app/storefront/src/scss/base.scss"
    ],
    "script": [],
    "asset": []
}
```

**FOUT die we maakten:** `@Storefront` vergeten in style array, waardoor hele theme niet werkte.

### 6. NOOIT Shopware JavaScript Functionaliteit Breken

**KRITIEK:** Shopware's Storefront JS is gekoppeld aan specifieke classes en data-attributen. Als je die overschrijft of verwijdert, werkt de JS niet meer!

**FOUT:**
```twig
{# FOUT - Shopware's collapse classes verwijderd #}
<div class="h1-footer-column">
    <h4>Menu titel</h4>
    <div class="h1-footer-links">...</div>
</div>
```

**GOED:**
```twig
{# GOED - Shopware's JS classes behouden #}
<div class="footer-column h1-footer-column">
    <div class="footer-column-headline" data-collapse-trigger>
        Menu titel
        <span class="footer-column-toggle"></span>
    </div>
    <div class="footer-column-content" data-collapse-target>...</div>
</div>
```

**FOUT die we maakten:** Shopware classes overschreven waardoor mobiele collapse/expand niet meer werkte.

**Regel:** BEHOUD altijd Shopware's:
- `data-*` attributen (voor JS plugins)
- Classes die beginnen met `footer-`, `nav-`, `offcanvas-` etc.
- Collapse/toggle structuur

### 7. Teksten via Snippet Systeem, NIET Hardcoded

**FOUT:**
```twig
{# FOUT - hardcoded tekst #}
<h2>Subscribe & get 10% OFF for first order</h2>
<button>Signup</button>
```

**GOED:**
```twig
{# GOED - via Shopware snippets (meertalig!) #}
<h2>{{ 'h1Theme.footer.newsletter.title'|trans|sw_sanitize }}</h2>
<button>{{ 'h1Theme.footer.newsletter.button'|trans|sw_sanitize }}</button>
```

**En maak snippet bestand:**
```
src/custom/plugins/H1Theme/src/Resources/snippet/
├── de_DE/
│   └── storefront.de-DE.json
├── en_GB/
│   └── storefront.en-GB.json
└── nl_NL/
    └── storefront.nl-NL.json
```

```json
// storefront.nl-NL.json
{
    "h1Theme": {
        "footer": {
            "newsletter": {
                "title": "Schrijf je in & ontvang 10% korting",
                "button": "Aanmelden"
            }
        }
    }
}
```

**FOUT die we maakten:** Alle teksten hardcoded waardoor meertaligheid niet mogelijk is.

### 8. Payment Icons zijn DYNAMISCH - NIET Hardcoden

**FOUT:**
```twig
{# FOUT - hardcoded payment icons #}
<div class="payment-icons">
    <svg><!-- Mastercard --></svg>
    <svg><!-- Visa --></svg>
    <svg><!-- PayPal --></svg>
</div>
```

**GOED:**
```twig
{# GOED - dynamisch uit Shopware configuratie #}
{% sw_include '@Storefront/storefront/layout/footer/footer-payment-logos.html.twig' %}
```

Of custom met Shopware's payment methods:
```twig
{% for paymentMethod in page.salesChannel.paymentMethods %}
    {% if paymentMethod.media %}
        <img src="{{ paymentMethod.media.url }}" alt="{{ paymentMethod.name }}">
    {% endif %}
{% endfor %}
```

**FOUT die we maakten:** Payment icons hardcoded waardoor admin ze niet kan aanpassen.

### 9. Icons via sw_include, NIET Inline SVG

**FOUT:**
```twig
{# FOUT - inline SVG in template #}
<svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M12..."/>
</svg>
```

**GOED:**
```twig
{# GOED - icon als apart bestand met sw_include #}
{% sw_include '@H1Theme/storefront/utilities/icon.html.twig' with {
    'name': 'shipping',
    'size': 'md'
} %}
```

Of gebruik Shopware's icon systeem:
```twig
{% sw_icon 'checkmark' style { 'size': 'sm' } %}
```

**FOUT die we maakten:** SVG's direct in Twig gezet, niet herbruikbaar en moeilijk te onderhouden.

### 10. Figma Icons: Download op DETAIL Niveau

**FOUT:**
```
Download: icon frame 24x24 → krijg je witruimte mee
```

**GOED:**
```
Download: alleen de PATH/SHAPE binnen het icon → exacte vector zonder padding
```

**In Figma MCP:**
```
Zoek in get_figma_data naar de diepste node (meestal type: "VECTOR" of "PATH")
Download DIE node, niet de parent frame
```

**FOUT die we maakten:** Icons op frame-niveau gedownload (24x24 met padding) i.p.v. op path-niveau (alleen de vorm).

**Tip:** In Figma, klik door naar de vector zelf en kopieer die node-id.

---

## PLAYWRIGHT TESTING WORKFLOW

### Stap 1: Figma Baseline Ophalen

```typescript
// EERST: Download Figma screenshot als baseline
// Sla op in: tests/figma-baselines/[component]-desktop.png
```

Gebruik Figma MCP:
```
mcp__figma__download_figma_images met:
- fileKey uit Figma URL
- nodeId van het specifieke component
- scale: 2 voor retina
```

### Stap 2: Test Structure

```typescript
// tests/[component]-figma.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8888';

// Design tokens uit Figma
const COLORS = {
  primary: 'rgb(242, 83, 5)',      // #F25305
  secondary: 'rgb(17, 17, 17)',    // #111111
  // etc...
};

test.describe('[Component] Figma Design Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  // 1. STRUCTURAL TESTS - Validate HTML structure
  test('component has correct structure', async ({ page }) => {
    const component = page.locator('.component-selector');
    await expect(component).toBeVisible();
    // Check for required child elements
  });

  // 2. VISUAL REGRESSION - Compare with Figma baseline
  test('visual regression - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const component = page.locator('.component-selector');
    await component.scrollIntoViewIfNeeded();

    await expect(component).toHaveScreenshot('[component]-desktop.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  // 3. FIGMA COMPARISON - Direct comparison with Figma export
  test('matches Figma design', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const component = page.locator('.component-selector');
    await component.scrollIntoViewIfNeeded();

    await expect(component).toHaveScreenshot('[component]-vs-figma.png', {
      maxDiffPixelRatio: 0.15,  // Meer tolerantie voor Figma comparison
      threshold: 0.3,
    });
  });

  // 4. CSS PROPERTY VALIDATION - Check specific design tokens
  test('css: has correct background color', async ({ page }) => {
    const element = page.locator('.element-class');
    if (await element.count() > 0) {
      await expect(element).toHaveCSS('background-color', COLORS.primary);
    }
  });

  // 5. RESPONSIVE TESTS
  test('visual regression - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    // ...
  });

  test('visual regression - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    // ...
  });
});
```

### Stap 3: Run en Analyseer

```bash
# Run specifieke test
npx playwright test [component]-figma.spec.ts

# Update baselines na goedgekeurde wijzigingen
npx playwright test --update-snapshots

# Bekijk diff bij failures
# Output staat in: test-results/[test-name]/
# - *-actual.png   (huidige implementatie)
# - *-diff.png     (visuele diff)
# - *-expected.png (baseline)
```

---

## IMPLEMENTATIE CHECKLIST

### Voor je begint:
- [ ] Figma URL/node-id genoteerd
- [ ] Design tokens geextraheerd (kleuren, fonts, spacing)
- [ ] Figma screenshot gedownload als baseline
- [ ] Alle icons/afbeeldingen uit Figma gedownload
- [ ] Bestaande Shopware template structuur bekeken

### Tijdens implementatie:
- [ ] `sw_extends` gebruikt (niet hele template overschrijven)
- [ ] Correcte block naam (check parent template!)
- [ ] Dynamische content via `sw_include` behouden
- [ ] CSS styled BEIDE custom EN Shopware classes
- [ ] `@Storefront` in theme.json style array
- [ ] Geen hardcoded content die uit CMS moet komen
- [ ] Shopware JS classes/data-attributen BEHOUDEN (collapse, toggle, etc.)
- [ ] ALLE teksten via snippet systeem (geen hardcoded strings!)
- [ ] Payment/shipping icons DYNAMISCH (niet hardcoded)
- [ ] Icons via sw_include of sw_icon (geen inline SVG)

### Na implementatie:
- [ ] `bin/console theme:compile` gerund
- [ ] Playwright tests draaien ZONDER failures
- [ ] Diff image bekeken en gevalideerd
- [ ] Responsieve viewports getest (desktop/tablet/mobile)

---

## VEELGEMAAKTE FOUTEN REFERENTIE

| Symptoom | Oorzaak | Oplossing |
|----------|---------|-----------|
| Template laadt niet | Verkeerd pad of block naam | Check parent template voor exacte block naam |
| Styling werkt niet | `@Storefront` mist in theme.json | Voeg toe aan style array |
| Content verdwenen | Hardcoded i.p.v. sw_include | Gebruik dynamische Shopware includes |
| CSS werkt niet | Verkeerde class names | Inspect element, style Shopware's classes |
| Icons kloppen niet | Zelf gemaakt i.p.v. Figma | Download via Figma MCP |
| Afmetingen kloppen niet | Niet goed naar Figma gekeken | Download Figma screenshot, vergelijk pixel-perfect |
| Tests falen steeds | Geen goede baseline | Gebruik Figma export als baseline |
| **Mobiel menu werkt niet** | Shopware JS classes verwijderd | Behoud `data-*` attributen en JS classes |
| **Geen vertalingen** | Hardcoded teksten | Gebruik snippet systeem met `\|trans` |
| **Payment icons niet aanpasbaar** | Hardcoded SVGs | Gebruik `sw_include` voor payment logos |
| **Icons niet herbruikbaar** | Inline SVG in templates | Maak icon component met `sw_include` |
| **Icons hebben witruimte** | Frame gedownload i.p.v. path | Download vector op detail niveau in Figma |

---

## COMMANDO'S QUICK REFERENCE

```bash
# Theme compileren
docker compose exec shopware bin/console theme:compile

# Cache legen
docker compose exec shopware bin/console cache:clear

# Playwright tests
npx playwright test                          # Alle tests
npx playwright test [file].spec.ts           # Specifiek bestand
npx playwright test [file].spec.ts:42        # Specifieke test (line number)
npx playwright test --update-snapshots       # Update baselines
npx playwright test --ui                     # UI mode voor debugging

# Figma MCP
# get_figma_data - Haal design structuur op
# download_figma_images - Download assets
```

---

## VOORBEELD WORKFLOW

```
1. ANALYSEER
   └── Figma MCP: get_figma_data voor component
   └── Noteer: kleuren, fonts, spacing, structuur
   └── Download: screenshot + alle icons/images

2. SETUP TESTS
   └── Maak [component]-figma.spec.ts
   └── Sla Figma screenshot op als baseline
   └── Schrijf structural tests eerst

3. IMPLEMENTEER
   └── Maak/extend Twig template
   └── Behoud dynamische Shopware content
   └── Schrijf SCSS die Shopware classes styled

4. VALIDEER
   └── Compileer theme
   └── Run Playwright tests
   └── Bekijk diff images
   └── Fix verschillen

5. ITERATE
   └── Herhaal stap 3-4 tot tests slagen
   └── Commit alleen als tests groen zijn
```

---

*Deze skill is ontwikkeld na een experiment waarbij backend developers frontend werk deden. De fouten die we maakten zijn gedocumenteerd zodat je ze niet hoeft te herhalen.*
