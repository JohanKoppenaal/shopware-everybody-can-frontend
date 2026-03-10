# Shopware Everybody Can Frontend

Dit project is een experiment om backend developers frontend werk te laten doen met behulp van:
- **Figma** als design source of truth
- **Playwright** voor visual regression testing
- **Shopware 6.7** als e-commerce platform

## Project Setup

```bash
# Start Shopware
docker compose up -d

# Run tests
npx playwright test

# Compile theme na wijzigingen
docker compose exec shopware bin/console theme:compile
```

## Belangrijke Regels voor Frontend Werk

### 1. Figma Assets Eerst
- Gebruik ALTIJD `mcp__figma__get_figma_data` en `mcp__figma__download_figma_images`
- Download icons/images UIT Figma, maak ze NIET zelf
- Sla Figma screenshots op als Playwright baselines

### 2. Shopware Template Rules
- Gebruik `sw_extends` - overschrijf nooit hele templates
- Check PARENT template voor exacte block namen
- Dynamische content via `sw_include` - NOOIT hardcoden

### 3. CSS/SCSS Rules
- Style Shopware's gegenereerde classes (`.footer-column`, `.footer-headline`)
- `@Storefront` MOET in theme.json style array staan
- Design tokens uit Figma halen

### 4. Testing Rules
- Maak Playwright tests VOORDAT je implementeert
- Gebruik Figma screenshot als baseline
- Run tests na elke wijziging

## Skills

- [docs/skills/shopware-figma.md](docs/skills/shopware-figma.md) - Guided Figma component implementatie

## Documentatie

Zie [SKILL.md](SKILL.md) voor uitgebreide documentatie en foutenreferentie.
