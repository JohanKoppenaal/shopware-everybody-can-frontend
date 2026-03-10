# Shopware Everybody Can Frontend

Training project: Back-end developers leren front-end met Figma + Playwright visual regression testing.

## Concept

Dit project helpt back-end developers om front-end te doen door:
1. **Figma design** als bron van waarheid
2. **Playwright tests** voor visuele validatie
3. **Dockware** voor lokale Shopware omgeving

## Quick Start

```bash
# Start Shopware
docker compose up -d

# Wacht tot Shopware klaar is (ca. 60 seconden)
# Configureer domain (eenmalig)
docker exec shopware-ecf bash -c "cd /var/www/html && bin/console sales-channel:update:domain localhost:8888 --previous-domain=localhost && bin/console cache:clear"

# Run tests
npm test
```

## Project Structuur

```
├── docker-compose.yml      # Shopware 6.7.8.0 container
├── playwright.config.ts    # Test configuratie
├── tests/
│   ├── footer-figma.spec.ts       # Footer design validation
│   ├── footer.spec.ts             # Basic footer tests
│   └── visual-regression.spec.ts  # Homepage tests
└── src/custom/plugins/
    └── H1Theme/           # Custom theme plugin
        ├── src/Resources/views/   # Twig templates
        └── src/Resources/app/     # SCSS styling
```

## Workflow voor Back-enders

### 1. Bekijk het Figma design
https://www.figma.com/design/meHFNqt42k9ca1N5KcAfN5/H1-Shopware-Theme?node-id=35-1512

### 2. Implementeer in Shopware
Edit de bestanden in `src/custom/plugins/H1Theme/`:
- Twig templates voor HTML structuur
- SCSS voor styling

### 3. Compile en test
```bash
# In de container
docker exec shopware-ecf bash -c "cd /var/www/html && bin/console theme:compile && bin/console cache:clear"

# Run Playwright tests
npm test
```

### 4. Review de diffs
Als tests falen, bekijk de screenshots in `test-results/`:
- `*-actual.png` - Wat je hebt
- `*-expected.png` - De baseline
- `*-diff.png` - Het verschil

### 5. Update baseline (als goed)
```bash
npm test -- --update-snapshots
```

## URLs

| Service | URL |
|---------|-----|
| Storefront | http://localhost:8888 |
| Admin | http://localhost:8888/admin |
| Adminer | http://localhost:8888/adminer |

**Admin login:** admin / shopware

## Design Specs

### Kleuren
| Naam | Hex |
|------|-----|
| Primary | `#F25305` |
| Secondary | `#111111` |
| Border | `#DDDDDD` |
| Light | `#EEEEEE` |

### Font
Inter (weights: 400, 700)

## Tools

- **Figma MCP** - Design data ophalen (configureer in `.mcp.json`)
- **Playwright** - Visual regression testing
- **Dockware** - Shopware Docker container
