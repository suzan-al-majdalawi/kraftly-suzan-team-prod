# Decision: Feature flags

## Kontext

M5 kräver att Norge-funktionen kan vara aktiverad i staging men avstängd i production utan att en ny image behöver byggas.

## Alternativ

### 1. Build-time flag

Flaggan byggs in när frontend-imagen skapas.

**Fördelar:**

- Enkel implementation.
- Ingen extra runtime-konfiguration.

**Nackdelar:**

- En ändring kräver en ny build.
- Samma image kan inte enkelt ha olika flaggvärden i staging och production.

### 2. Runtime environment/config

Flaggan sätts när applikationen startar och läses från runtime-konfiguration.

**Fördelar:**

- Samma image kan användas i staging och production.
- Production kan ha Norge avstängt utan ny build.
- Passar M5-kravet om samma image genom pipeline.

**Nackdelar:**

- Kräver runtime-konfiguration.
- Konfigurationen måste verifieras vid deployment.

### 3. Databasbaserad feature flag

Flaggan sparas i en databas och läses dynamiskt av applikationen.

**Fördelar:**

- Kan ändras utan deployment.
- Kan ge mer avancerad styrning senare.

**Nackdelar:**

- Kräver databas och ytterligare infrastruktur.
- Onödigt komplext för den nuvarande Norge-funktionen.

## Beslut

Vi använder **runtime-konfiguration** för Norge-flaggan.

Staging har:

```text
FEATURE_NORWAY=true
```

Production har inte Norge-flaggan aktiverad.

Samma image kan därför deployeras till båda miljöerna och beteendet bestäms av runtime-konfigurationen.

## När ska flaggan tas bort?

När Norge-funktionen är permanent aktiverad och inte längre behöver kunna stängas av ska feature flaggen tas bort.

Då ska:

1. flaggan tas bort från runtime-konfigurationen,
2. villkoret i applikationen tas bort,
3. tester uppdateras,
4. dokumentationen uppdateras.
