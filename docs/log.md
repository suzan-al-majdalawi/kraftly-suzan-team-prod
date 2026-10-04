# Daily standup – Suzan Al Majdalawi

**Datum:** 2026-08-28, 2026-09-01 och 2026-09-14

## 2026-08-28 och 2026-09-01

### Vad har jag gjort sedan senast?

Jag har gått igenom lektionerna i Canvas och tränat och övat på uppgifterna tillsammans med teamet. Jag har arbetat vidare med M1 och bland annat med Vitest, Playwright, ESLint, Prettier och pre-commit-hooken.

Under dagen färdigställde vi testmiljön med Vitest och Playwright. Vi skapade ett Playwright-smoketest och dokumenterade vårt beslut att använda Playwright som E2E-verktyg. Vi arbetade också med ESLint och Prettier och såg till att linting, formatering och pre-commit fungerar.

Jag har även arbetat med GitHub och Pull Requests. Jag har två GitHub-konton och har bland annat öppnat och mergat en Pull Request via mobilen och Gmail på mitt äldre konto.

### Vad ska jag göra idag?

Jag ska arbeta vidare med de uppgifter jag har missat och färdigställa dokumentationen inför M1. Jag ska också kontrollera att tester, lint, formattering och Playwright E2E-test fungerar innan ändringarna skickas till `main`.

### Några hinder – vad var svårt?

Det som varit svårt är att jag på grund av sjukdom inte kunde göra och skicka in uppgifterna i samma takt som planerat. Jag hoppas att det blir bättre framöver.

Tekniskt var det svårt att konfigurera ESLint med den nya konfigurationsmodellen. Vi fick också ett runtime-fel med `toFixed` när priset ännu inte hade laddats. Playwright försökte först läsa Vitest-testerna, vilket löstes genom att separera E2E-testerna i `e2e/`.

Inspelningarna av videolektionerna har varit väldigt hjälpsamma. Det är bra att kunna repetera lektionerna två eller flera gånger för att förstå och komma ihåg momenten bättre.

### Vad gjorde teamet?

Teamet arbetade tillsammans med teststrategi, felsökning, ESLint/Prettier-konfiguration, pre-commit och Playwright E2E-test. Vi färdigställde även beslutet om Playwright och dokumentationen kring teststrategin.

### Vem gjorde vad?

Jag, Suzan Al Majdalawi, arbetade med testmiljön, felsökning, ESLint, Prettier, pre-commit, Playwright E2E-test och dokumentationen.

Eftersom jag arbetade själv med uppgifterna använde jag ChatGPT som stöd när jag behövde förstå felmeddelanden, kontrollera konfigurationer och diskutera olika tekniska lösningar. Jag ställde frågor och diskuterade lösningarna steg för steg innan jag gjorde ändringarna i projektet.

De tekniska ändringarna och besluten i koden genomfördes och kontrollerades av mig.

---

## 2026-09-14 – Individuellt arbete med M3

### Vad har jag gjort sedan senast?

Jag repeterade innehållet från tidigare lektioner och fortsatte arbeta med M3. Torsdagen veckan innan arbetade jag tillsammans med två olika team i klassen med samma uppgift. Nu arbetar jag självständigt med samma uppgift i mitt eget team.

Det har varit lärorikt att arbeta med olika personer och jämföra olika sätt att lösa samma problem. Jag har också fått möjlighet att förklara för andra hur man kan gå tillväga steg för steg, vilket hjälpte mig att själv förstå de tekniska lösningarna bättre.

Jag arbetade vidare med README och dokumentationen för Docker, så att det blir tydligt hur projektet startas både med och utan Docker. Jag uppdaterade även `containers`-filen och färdigställde den sista filen som behövde fixas.

Jag kontrollerade sedan min Pull Request och såg till att alla kontroller och tester blev gröna. När allt var färdigt testade jag även projektet från `main`-branchen genom att hämta de senaste ändringarna och starta projektet med Docker.

### Vad ska jag göra idag?

Jag ska göra den sista kontrollen av M3 genom att säkerställa att projektet fungerar från `main` och att inloggningen fungerar när projektet startas med Docker.

När allt är godkänt ska jag skapa och pusha M3-taggen:

```bash
git checkout main
git pull
docker compose up --build
git tag -a M3 -m "M3 – Containeriserad"
git push origin M3
```

### Några hinder – vad var svårt?

Det som var mest utmanande var att få alla delar att fungera tillsammans, framför allt Docker, containers-konfigurationen och projektets start från en ren `main`-branch.

Det var också viktigt att kontrollera att ändringarna verkligen fungerade från det färdiga repositoryt och inte bara från min lokala arbetsbranch. Därför testade jag projektet efter att ha bytt till `main` och hämtat de senaste ändringarna.

### Vad gjorde teamet?

Eftersom jag arbetade individuellt med M3 fokuserade jag på att färdigställa de delar som behövdes för att projektet skulle vara klart för M3. Jag uppdaterade dokumentationen, containers-konfigurationen och den sista filen som behövde färdigställas.

Den nya tech leaden har också presenterats för teamet, så vi har nu en tydligare ansvarsfördelning inför det fortsatta arbetet.

### Vem gjorde vad?

Jag, Suzan Al Majdalawi, arbetade med README, Docker-dokumentationen, containers-filen och den sista filen som behövde fixas. Jag kontrollerade även Pull Requesten och såg till att den blev grön innan M3 färdigställdes.

Jag använde ChatGPT som stöd när jag behövde förstå tekniska problem, kontrollera Docker-konfigurationen och diskutera olika lösningar. Jag genomförde själv ändringarna i projektet och kontrollerade att de fungerade.

M3 är nu färdig och alla kontroller är gröna. Projektet är testat från `main` och fungerar med Docker. Nästa steg är därför att skapa och pusha taggen `M3`.
