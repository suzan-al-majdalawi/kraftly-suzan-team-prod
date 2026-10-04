# M3

## Alla punkter ska vara uppfyllda på main när taggen sätts:

[X] Multi-stage Dockerfile i repots rot: byggsteg med Node, serveringssteg med nginx. Ingen Node och ingen node_modules i den färdiga imagen

[X] .dockerignore med minst node_modules, dist och .git

[X] nginx.conf med SPA-fallback – omladdning på /fakturor ger appen, inte 404

[X] Imagen är under 100 MB – skärmdump av docker image ls i docs/containers.md. Har du två storlekskolumner gäller DISK USAGE, den första

[X] docker compose up --build från ett rent klon startar frontend (localhost:8080) och mock-API, och man kan logga in och se dashboarden

[X] docker build som eget jobb i CI (image), grönt på main, med imagens storlek i loggen

[X] docs/containers.md enligt mallen från workshopen: hur man kör, storlekstabell med uppmätta siffror (minst naiv vs. multi-stage), tre beslut (basimage · hur mock-API:t körs · hur browsern når API:t), vad som körs i CI, kända begränsningar

[X] README Getting started omskriven: ett sätt med Docker, ett utan – och npm start-felet borta (skulden från M0)

[X] Logg i docs/log.md: en post per arbetsdag, inklusive vem som gjorde vad. Ny tech lead presenterad i loggen

###

Definition of Done
Bocka av i docs/milestones.md under rubriken M1. Alla punkter ska vara uppfyllda på main när taggen sätts:

## M1

Testsvit med minst 10 meningsfulla test – både logik (enhet) och komponent, körbara med npm run test:run, alla gröna
Minst 5 av testerna är på kod som inte var med i torsdagens övningar (stores, api.js, LoginView, ProfileView, spinnern, det svalda felet …)
Minst ett regressionstest på en bugg ur er docs/debt.md – ett test som hade fångat buggen om den funnits kvar. Skriv i testnamnet eller en kommentar vilken skuld det gäller
ESLint + Prettier körs i pre-commit via husky + lint-staged. npm run lint och npm run format:check går igenom på main utan errors
Teststrategi i docs/testing.md enligt strukturen från workshopen: nivåer, karta över vad som testas var, era fem beslut (inkl. täckningskrav ja/nej och varför), vad ni medvetet inte testar
E2E-beslutet dokumenterat i docs/decisions/e2e-verktyg.md (se nedan), och det valda verktygets smoke-test mergat till main (körbart med npm run e2e:pw eller npm run e2e:cy)
Logg i docs/log.md: en post per arbetsdag – vad ni gjorde, vad som var svårt, vem som gjorde vad
Meningsfulla betyder: varje test skulle fånga en riktig bugg om den återkom. Tio bra test slår trettio tomma. Tester som testar Vue, Chart.js eller ett klassnamn räknas inte.
