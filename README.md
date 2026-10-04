# kraftly-mina-sidor

Customer portal for Kraftly. Delivered by Webbmakarna AB 2026-06-30.

[![CI](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml/badge.svg)](https://github.com/suzan-al-majdalawi/kraftly-suzan-team/actions/workflows/ci.yml)

## Getting started

### Alternativ 1 – Docker

Det rekommenderade sättet att starta projektet är med Docker Compose.

1. Öppna Docker Desktop och kontrollera att Docker körs.
2. Öppna terminalen i projektets rotmapp.
3. Kör:

```bash
docker compose up --build
```

# Öppna sedan:

[http://localhost:8080](http://localhost:8080)
Frontend körs via nginx och mock API:t körs i en separat container.

# att stoppa containrarna:

```bash
docker compose down
```

#att vissa images i containrarna:

```bash
docker image ls
```

### Alternativ 2 – utan Docker

Installera projektets dependencies:

```bash
npm install
```

Starta mock API:t:

```bash
npm run api
```

Starta utvecklingsservern:

```bash
npm run dev
```

Öppna sedan:
[http://localhost:5173](http://localhost:5173)

I utvecklingsläge proxas `/api` till mock API:t på port 4000.

## Arbetsavtal

## Kommunikation

Vi fokuserar på att lösa problemen tillsammans. Om någon behöver hjälp frågar vi i teamets kommunikationskanal och söker efter problemet tillsammans.

## Mötestider

Vid behov frågar vi i Slack eller annan överenskommen kommunikationskanal.

## Definition of done för PR:er

- Vilket ticket eller issue?
- Vad ändrades?
- Varför?
- Hur testar man?
- Checklista:
  - Jag har kört appen och verifierat ändringen.
  - Commit-meddelandet följer Conventional Commits.
  - Grenen utgår från en färsk `main`.
  - Ticketets "Klar när"-punkter är avbockade.

## Tech lead-schema för rotationen

Vecka 1–9.

## Git

Vi använder kortlivade feature branches.
Alla ändringar i `main` går igenom en Pull Request.
Minst en teammedlem måste granska PR:n innan merge.

## Commits

Vi använder Conventional Commits på varje PR.

### Varför detta löser M3

Det viktiga är att README nu visar:

- 🐳 **Docker-vägen:** `docker compose up --build` eller `docker compose up -d`
- 🐳 **Stop-Docker-vägen:** `docker compose down`
- 🌐 Frontend: `localhost:8080`
- 🧪 **Utan Docker:** `npm install` + `npm run dev`
- ❌ Den gamla `npm start` är borta
- ❌ `TODO: write proper documentation` är borta
- ❌ Dubbla `kraftly-portal`-rubriker är borta
- ✅ CI-badge finns kvar
- ✅ Projektets Git/PR-regler finns kvar

## M5:

### Production deployeras via GitHub Actions med staging-verifierad image/SHA och kräver production approval.
