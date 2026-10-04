# Beslut: verktyg för E2E-tester

**Datum:** 2026-08-28 2026-08-31-08 2026-09-01
**Beslut:** Vi använder **Playwright** för end-to-end-tester.

## Bakgrund

Vi behövde välja ett E2E-verktyg för att kunna skriva ett smoke-test som kan köras i CI i M2. Vi ville också ha möjlighet att testa användarflöden och mocka API-anrop vid behov.

## Alternativ vi jämförde

Vi jämförde **Cypress** och **Playwright** utifrån våra egna observationer från workshopen.

| Område                     | Cypress                     | Playwright                          |
| -------------------------- | --------------------------- | ----------------------------------- |
| Tid till första gröna test | 953 ms                      | 1,7 s                               |
| Hitta element              | `cy.get()`, `cy.contains()` | `getByRole()`, `getByPlaceholder()` |
| Mockning                   | `cy.intercept()`            | `page.route()`                      |
| Väntan/flakiness           | Behöver ibland `cy.wait()`  | `expect` väntar automatiskt         |
| Headless i CI              | Ja                          | Ja                                  |
| Felmeddelanden             | Tydliga                     | Tydliga och lätta att följa         |

## Motivering

Vi väljer Playwright eftersom testkoden är tydlig och det är enkelt att se var ett test misslyckas. Vi tycker också att element-sökningen med exempelvis `getByRole()` gör testerna lätta att förstå. Playwright passar vårt behov av ett smoke-test som kan köras headless i CI.

## Konsekvenser

Vi ger upp möjligheten att använda Cypress, som teamet redan har erfarenhet av. Playwright är något långsammare i vårt första test, men skillnaden är liten. Om vi vill byta verktyg senare behöver vi skriva om våra E2E-tester och uppdatera CI-konfigurationen.

## Smoke-test

Vårt Playwright-smoketest finns i:

`e2e/smoke.spec.js`

Det kan köras med:

```powershell
npm run e2e:pw
```

Smoke-testet kontrollerar att startsidan laddas korrekt.

## Aktuell teststatus

Vi har även arbetat med komponenttester för `ProfileView` med Vitest och Vue Test Utils.

Filen är:

`src/views/ProfileView.spec.js`

Just nu innehåller testfilen **4 tester**:

- 3 tester passerar.
- 1 test misslyckas.

Det misslyckade testet är:

`visar kundnummer och användaruppgifter`

De tre tester som passerar är:

- `sparar ändrade användaruppgifter`
- `återställer ändringar när användaren klickar på Ångra`
- `laddar användaren om store.user saknas`

Testresultatet är alltså just nu:

```text
src/views/ProfileView.spec.js
4 tester | 1 misslyckades

3 passed
1 failed
```

Det misslyckade testet behöver felsökas och rättas innan komponenttesterna är helt gröna.

Detta påverkar inte beslutet att använda Playwright som E2E-verktyg. `ProfileView.spec.js` är ett komponenttest med Vitest, medan `e2e/smoke.spec.js` är vårt E2E-test med Playwright.
