# H1 Theme - Shopware Plugin

Custom Shopware theme gebaseerd op het Figma design.

## Design Reference

**Figma:** https://www.figma.com/design/meHFNqt42k9ca1N5KcAfN5/H1-Shopware-Theme?node-id=35-1512

## Structuur

```
H1Theme/
├── composer.json           # Plugin configuratie
├── src/
│   ├── H1Theme.php        # Plugin entry point
│   └── Resources/
│       ├── views/         # Twig templates
│       │   └── storefront/
│       │       └── layout/
│       │           └── footer/
│       │               └── footer.html.twig  # Footer template
│       └── app/
│           └── storefront/
│               └── src/
│                   └── scss/
│                       └── base.scss  # Footer styling
```

## Design Specs (uit Figma)

### Kleuren
| Naam | Hex | Gebruik |
|------|-----|---------|
| Primary | `#F25305` | Buttons, accenten |
| Secondary | `#111111` | Tekst, backgrounds |
| White | `#FFFFFF` | Achtergronden |
| Gray | `#666666` | Placeholder tekst |
| Border | `#DDDDDD` | Lijnen, borders |
| Light | `#EEEEEE` | Copyright bar |

### Typography
- **Font:** Inter
- **H3:** 24px, bold
- **H4:** 20px, bold
- **MD-bold:** 16px, bold
- **Normal-regular:** 14px, regular
- **XS-bold:** 12px, bold

### Footer Secties
1. **Newsletter** - Donkere achtergrond met signup form
2. **USP Bar** - 4 items met icons
3. **Kolommen** - Partner, Help Center, Company, Shop by category, Contact
4. **Copyright** - Lichte achtergrond met payment icons

## Installatie

```bash
# In de Shopware container
bin/console plugin:refresh
bin/console plugin:install --activate H1Theme
bin/console theme:compile
bin/console cache:clear
```

## Development Workflow

1. Pas de Twig template of SCSS aan
2. Compile het theme: `bin/console theme:compile`
3. Clear cache: `bin/console cache:clear`
4. Run Playwright tests: `npm test`
5. Als design klopt, update baseline: `npm test -- --update-snapshots`
