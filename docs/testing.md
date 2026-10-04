# Teststrategi – Kraftly Mina sidor

## 1. Syfte

Syftet med teststrategin är att fånga fel i vår egen kod, skydda viktig funktionalitet och göra det säkrare att ändra applikationen.

Vi fokuserar på meningsfulla tester som skulle kunna upptäcka en riktig bugg om den återkommer. Vi prioriterar därför viktig affärslogik och användarflöden framför att försöka få så hög testtäckning som möjligt.

---

## 2. Testnivåer

Vi använder tre testnivåer.

### Enhetstest – Vitest

Enhetstester används för isolerad logik och funktioner.

I vår kodbas testar vi bland annat:

- prisformatering i `src/utils/price.js`
- användarnamn och namnlogik i `src/utils/user.js`
- validering av flyttuppgifter i `src/utils/validateMove.js`
- annan isolerad affärslogik

Enhetstesterna körs med:

```bash
npm run test:run
```

### Komponenttest – Vitest + Vue Testing Library

Komponenttester används när en Vue-komponent innehåller viktig funktionalitet som behöver testas genom komponentens beteende.

Vi använder komponenttester för exempelvis:

- formulär
- felmeddelanden
- knappar och användarinteraktioner
- rendering av data
- loading/spinner-beteende
- LoginView och ProfileView där funktionaliteten är viktig

Vi testar komponentens beteende snarare än interna implementationer eller CSS-klasser.

### E2E-test – Playwright

Vi använder Playwright för end-to-end-tester.

E2E används för de viktigaste användarflödena där flera delar av applikationen behöver fungera tillsammans.

Vårt smoke-test kontrollerar att startsidan kan laddas korrekt.

E2E-testet körs med:

```bash
npm run e2e:pw
```

---

## 3. Testkarta för vår kodbas

| Kodområde                   | Testnivå                 | Vad vi kontrollerar                                    |
| --------------------------- | ------------------------ | ------------------------------------------------------ |
| `src/utils/price.js`        | Enhetstest               | Att priser formateras korrekt                          |
| `src/utils/user.js`         | Enhetstest               | Att namn hanteras korrekt                              |
| `src/utils/validateMove.js` | Enhetstest               | Att flyttuppgifter valideras korrekt                   |
| `src/stores/user.js`        | Enhetstest/komponenttest | Att användardata laddas och sparas korrekt             |
| `src/services/api.js`       | Enhetstest               | Att API-funktionerna hanterar svar och fel korrekt     |
| `LoginView.vue`             | Komponenttest            | Inloggningsbeteende och felhantering                   |
| `ProfileView.vue`           | Komponenttest            | Visning och ändring av användaruppgifter               |
| `MoveFormView.vue`          | Komponenttest            | Formulär och validering                                |
| Spinner/loading             | Komponenttest            | Att laddningsläge visas korrekt                        |
| Viktigt användarflöde       | E2E                      | Att applikationen fungerar från användarens perspektiv |

Vi testar alltså olika saker på olika nivåer. Detaljerad logik testas främst med enhetstester, komponentbeteende med komponenttester och hela användarflöden med Playwright.

---

## 4. Mockning av API

Vi undviker att enhetstester och komponenttester är beroende av ett riktigt nätverk.

### Enhetstest och komponenttest

API-anrop mockas där det behövs, exempelvis med Vitests `vi.mock`.

Det gör testerna snabba och deterministiska och gör det möjligt att testa både lyckade och misslyckade API-svar.

### E2E

Playwright kör applikationen tillsammans med projektets mock-API.

På så sätt kan vi testa ett verkligt användarflöde utan att vara beroende av produktionsdata eller ett externt API.

---

## 5. Våra fem testbeslut

### Beslut 1 – Enhetstester för affärslogik

Vi testar isolerad affärslogik med Vitest.

Det ger snabba tester och gör det enkelt att hitta exakt vilken funktion som orsakar ett fel.

### Beslut 2 – Komponenttester för viktigt UI-beteende

Vi använder Vitest och Vue Testing Library för komponenter där användarbeteendet är viktigt.

Vi testar vad användaren kan se och göra i stället för komponentens interna implementation.

### Beslut 3 – Playwright för E2E

Vi har valt Playwright framför Cypress för våra E2E-tester.

Vi upplevde att Playwright gav tydlig testkod, bra felmeddelanden och automatisk väntan genom `expect`. Vi såg också att nätverksmockning kan göras med `page.route()`.

Vi valde därför Playwright för M1:s smoke-test och för framtida kritiska användarflöden.

Detta beslut är dokumenterat separat i:

`docs/decisions/e2e-verktyg.md`

### Beslut 4 – Inget fast coverage-krav

Vi har valt att inte kräva en viss procent test coverage, exempelvis 80 %.

Anledningen är att hög coverage inte automatiskt betyder bra tester. Vi prioriterar i stället meningsfulla tester för viktig logik och funktionalitet.

### Beslut 5 – Regressionstest för buggar

Varje viktig buggfix ska få ett regressionstest.

Testet ska beskriva det beteende som tidigare var fel och ska kunna fånga samma bugg om den återkommer.

Regressionstesterna kopplas till teknisk skuld i `docs/debt.md` när buggen kommer därifrån.

---

## 6. Regressionstester

Vi använder regressionstester för att skydda tidigare buggfixar.

Exempel är test av prisformatering och validering där ett felaktigt resultat tidigare skulle kunna påverka användaren.

Regressionstestet ska vara tillräckligt specifikt för att misslyckas om den gamla buggen återkommer.

I testnamnet eller en kommentar anger vi vilken skuld i `docs/debt.md` testet skyddar.

---

## 7. Vad vi medvetet inte testar

Vi testar inte externa bibliotekens interna funktionalitet.

Vi testar därför inte:

- om Chart.js i sig kan skapa ett diagram
- om Vue Router internt fungerar
- om Vitest fungerar
- om Playwright fungerar
- CSS-klasser enbart för deras egen skull
- implementationdetaljer som inte påverkar användaren
- externa API:er eller produktionssystem i våra vanliga tester

Vi testar däremot vår egen kods användning av dessa bibliotek.

Exempelvis kan vi testa att vår komponent skickar rätt data till ett diagram, men vi testar inte Chart.js interna rendering.

---

## 8. Testprinciper

När vi skriver tester följer vi dessa principer:

1. Vi testar vår egen kod och inte externa bibliotek.
2. Viktig ny logik ska ha relevanta tester.
3. Buggfixar ska ha regressionstester.
4. API-anrop mockas i tester där det behövs.
5. E2E-tester ska fokusera på kritiska användarflöden.
6. Vi testar beteende framför implementation.
7. Testerna ska vara deterministiska och inte bero på riktigt nätverk eller aktuell tid när det kan undvikas.
8. Vi prioriterar meningsfulla tester framför ett specifikt coverage-procenttal.
9. Alla relevanta tester ska vara gröna innan en Pull Request mergas.

---

## 9. Testkommandon

### Enhetstest och komponenttest

Kör alla Vitest-tester en gång:

```bash
npm run test:run
```

`npm test` används för Vitests watch-läge under utveckling.

### E2E

Kör Playwrights smoke-test:

```bash
npm run e2e:pw
```

### Lint

```bash
npm run lint
```

### Formatering

Kontrollera formateringen:

```bash
npm run format:check
```

---

## 10. Sammanfattning

Vår teststrategi bygger på att varje testnivå har ett tydligt ansvar.

| Testnivå      | Verktyg                      | Huvudsyfte                                  |
| ------------- | ---------------------------- | ------------------------------------------- |
| Enhetstest    | Vitest                       | Isolerad logik och affärsregler             |
| Komponenttest | Vitest + Vue Testing Library | Viktigt UI-beteende och användarinteraktion |
| E2E           | Playwright                   | Kritiska användarflöden                     |

Målet är inte att testa all kod på samma sätt. Vi vill ha snabba och precisa enhetstester för logik, komponenttester för viktigt gränssnittsbeteende och ett mindre antal E2E-tester som verifierar att hela applikationen fungerar tillsammans.
