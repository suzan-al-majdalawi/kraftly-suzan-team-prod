# Milestones

## M5 – Produktionsmiljö

### Produktionsmiljö

- [x] Separat production-miljö i Render.
- [x] Production använder `APP_ENV=production`.
- [x] Production deployeras via GitHub Actions.
- [x] Production använder samma image/SHA som har verifierats i staging.
- [ ] Slutlig verifiering av att staging och production kör samma SHA.

**Bevis – version.txt**

```text
Staging:
[KListra in curl-utskriften här]

Production:
[KListra in curl-utskriften här]

Git HEAD:
[KListra in git rev-parse HEAD här]
```

### Approval

- [x] Production ligger bakom GitHub Environment `production`.
- [x] Production-deploy kräver godkännande innan deployment fortsätter.
- [x] Production använder ett separat Render Deploy Hook från staging.

### Feature flag – Norge

- [x] Norge-funktionen styrs av en runtime feature flag.
- [x] Flaggan är aktiverad i staging.
- [x] Flaggan är avstängd i production.
- [x] Flaggan styrs av runtime-konfiguration och inte av build-time.

**Bevis**

```text
Staging:
[KListra in relevant config/svar här]

Production:
[KListra in relevant config/svar här]
```

### Cache

- [x] Statiska assets använder lång cache.
- [x] `index.html`, `config.js` och `version.txt` använder `no-cache`.
- [x] Cache-konfigurationen finns i nginx.

### Rollback

- [x] Rollback kan köras via GitHub Actions.
- [x] Rollback använder en tidigare SHA/image.
- [x] Rollback bygger inte om imagen.

**Bevis**

Rollback workflow:
[KListra in länk till GitHub Actions rollback-körningen här]

Rollback SHA:

```text
[SHA]
```

Resultat:

```text
[KListra in relevant output här]
```

### M5 slutkontroll

När production är verifierad ska följande tre värden vara samma:

```text
Staging SHA:   [SHA]
Production SHA:[SHA]
Git HEAD:      [SHA]
```

**Resultat:** [Fylls i efter slutlig production-verifiering]
