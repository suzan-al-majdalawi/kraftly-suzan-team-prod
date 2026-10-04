# Skalning – Kraftly Mina sidor

## Vad vi vet om trafiken

Vi har cirka **40 000 kunder per månad**. Förväntade trafiktoppar kan uppstå exempelvis på:

- fakturadagen
- vid större elprisnyheter
- när Kraftly lanseras i Norge

Eftersom vi inte har exakta produktionsdata för framtida toppar gör vi en uppskattning.

Vi antar att **25 % av månadens 40 000 kunder**, alltså 10 000 kunder, är aktiva under en topp.

Om **10 % av dessa aktiva kunder** gör ett API-anrop under samma minut blir det:

- 10 000 aktiva kunder
- 10 % gör ett API-anrop
- = **1 000 API-anrop per minut**

Det motsvarar ungefär:

**1 000 / 60 ≈ 17 req/s**

Detta är vår uppskattning av en möjlig topplast. Det är en uppskattning och inte ett uppmätt produktionsvärde.

---

## Vad vi mätte

Belastningstester kördes den **25 september 2026**.

Vi använde `autocannon` för att mäta svarstid och antal requests per sekund.

### 1. GET `/`

```bash
npx autocannon -c 50 -d 10 http://localhost:8080/
```

Resultat:

````
| Mätvärde    |  Resultat |
| ----------- | --------: |
| Avg Req/s   | 42 337,46 |
| p99 latency |     14 ms |

Testet kördes lokalt.
```
---
### 2. GET `/assets/index-*.js`

```bash
npx autocannon -c 50 -d 10 http://localhost:8080/assets/index-BcsE5Ybd.js
```

Resultat:

| Mätvärde    |  Resultat |
| ----------- | --------: |
| Avg Req/s   | 47 477,82 |
| p99 latency |     18 ms |

Testet kördes lokalt.

---

### 3. GET `/api/user`

Efter att applikationen kördes i Docker testade vi API-endpointen:

```bash
npx autocannon -c 50 -d 10 http://localhost:8080/api/user
```

Resultat:

| Mätvärde              |     Resultat |
| --------------------- | -----------: |
| Connections           |           50 |
| Testtid               |      10,04 s |
| Avg Req/s             |    **2 141** |
| p99 latency           |    **50 ms** |
| Avg latency           | **22,83 ms** |
| Max latency           |   **154 ms** |
| Totalt antal requests | cirka 21 000 |
| Data read             |      10,6 MB |

Testet kördes lokalt mot vår Docker-container.

---

### 4. Test mot staging

Vi testade även staging-miljön:

```bash
npx autocannon -c 10 -d 10 https://kraftly-suzan-team-staging.onrender.com/
```

Resultat:

| Mätvärde    |     Resultat |
| ----------- | -----------: |
| Connections |           10 |
| Testtid     |         10 s |
| Avg Req/s   |      **204** |
| p99 latency |    **68 ms** |
| Avg latency | **48,55 ms** |
| Max latency |   **193 ms** |

Testet kördes mot staging och inte mot produktion.

---

## Sammanställning

| Anrop                    | Miljö         | Connections | Avg Req/s |       p99 | Kommentar              |
| ------------------------ | ------------- | ----------: | --------: | --------: | ---------------------- |
| GET `/`                  | Lokal         |          50 | 42 337,46 |     14 ms | Statisk frontend       |
| GET `/assets/index-*.js` | Lokal         |          50 | 47 477,82 |     18 ms | Statisk JavaScript-fil |
| GET `/api/user`          | Docker lokalt |          50 | **2 141** | **50 ms** | API-test               |
| GET `/`                  | Staging       |          10 |   **204** | **68 ms** | 10 sekunders test      |

---

## Vad siffrorna säger

I den lokala Docker-mätningen klarade `/api/user` **2 141 req/s i genomsnitt** med en p99-latens på **50 ms**. Den genomsnittliga latensen var **22,83 ms** och den högsta uppmätta latensen var **154 ms**.

Det är betydligt högre genomströmning än vår tidigare lokala mätning. Testresultatet visar att applikationen i den aktuella Docker-miljön klarar en högre belastning än den uppskattade topplasten.

Vår uppskattade topplast är cirka **1 000 anrop per minut**, vilket motsvarar cirka **17 req/s**.

Jämfört med detta gav Docker-testet:

**2 141 req/s**

Det är cirka 126 gånger högre än vår uppskattade genomsnittliga topplast på 17 req/s.

Det betyder dock inte att produktionen automatiskt klarar 2 141 req/s. Testet kördes lokalt mot Docker och är därför inte ett direkt mått på produktionsmiljön.

Staging-testet gav **204 req/s** med p99 på **68 ms**. Det testet kördes med 10 samtidiga anslutningar under cirka 10 sekunder. Även detta är ett kort belastningstest och säger inte exakt hur systemet beter sig under en långvarig produktionsbelastning.

---

# Vad vi gjorde

## 1. Cache-headers

Vi har kontrollerat cache-inställningarna för statiska filer.

Stagingkontrollen med `curl -I` visar att hashade filer under `/assets/` kan cachas under lång tid medan filer som `index.html`, `config.js` och `version.txt` ska kunna återvalideras.

Hashade assets kan exempelvis använda:

```http
Cache-Control: public, max-age=31536000, immutable
```

För `config.js` används:

```http
Cache-Control: no-cache
```

Det gör att webbläsaren kan cacha statiska och hashade filer länge, samtidigt som runtime-konfigurationen kan kontrolleras vid nya besök.

Det minskar onödiga nedladdningar och belastningen på webbservern.

---

## 2. CDN – nu / senare / aldrig

Vi använder inte ett separat CDN som en nödvändig del av lösningen just nu.

Våra lokala mätningar visar mycket hög genomströmning för de statiska frontendfilerna:

* GET `/`: 42 337 req/s
* GET `/assets/index-*.js`: 47 478 req/s

Därför visar de nuvarande testerna inget konkret behov av att lägga till ett CDN direkt.

### Senare

Ett CDN kan införas senare om produktionsmätningar visar att:

* statiska filer skapar hög belastning på webbservern
* trafiken ökar kraftigt
* geografisk spridning gör CDN relevant
* svarstiderna påverkas av mängden statisk trafik

Då krävs bland annat:

* CDN-konfiguration
* DNS/domänkoppling
* cache-regler
* test av cache invalidation
* kontroll av att nya assets distribueras korrekt

---

## 3. Fler instanser – vid vilken siffra?

En föreslagen starttröskel är:

> **CPU över 70 % i minst fem minuter under förväntad topplast.**

Detta är en operativ startpunkt och inte en gräns som våra nuvarande belastningstester har bevisat.

Vi behöver följa CPU, minne, svarstider och fel i den riktiga driftmiljön innan vi kan fastställa en mer exakt skalningströskel.

Om belastningen fortsätter att öka och en instans inte längre räcker kan flera instanser användas för horisontell skalning.

---

## 4. Det vi inte kan påverka – API:et

Vår lokala `/api/user`-mätning är gjord mot vår Docker-miljö.

Det innebär att resultatet inte kan användas som bevis för produktions-API:ets kapacitet.

Vi ber backend-teamet att bekräfta:

* API:ets kapacitet vid topplast
* rate limits
* svarstider
* fel vid hög belastning
* eventuell kallstart
* hur API:et skalar vid samtidiga requests
* eventuella begränsningar i externa beroenden

Det är särskilt viktigt eftersom frontendens kapacitet inte automatiskt betyder att backend-API:t har samma kapacitet.

---

# Varför (inte) Kubernetes

Vi gjorde inte övning 2B.

Kubernetes kan användas när man behöver hantera flera containers och automatisk skalning. För Kraftly har våra nuvarande mätningar och vår uppskattade trafik inte visat ett konkret behov av Kubernetes.

Vår uppskattade topplast är cirka:

**17 req/s**

Vårt lokala Docker-test av `/api/user` klarade:

**2 141 req/s**

Det finns därför inget i dessa tester som visar att vi behöver flera containers just nu.

Kubernetes skulle också innebära mer konfiguration, övervakning och drift att lära sig och underhålla.

Om trafikmängden senare ökar kraftigt eller om driftmätningar visar att en container inte räcker kan behovet omprövas.

---

# När stänger man en flagga i stället för att rulla tillbaka?

|                | Feature flag                                            | Rollback                                                           |
| -------------- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| **Tar**        | Inte mätt; beror på hur flaggan ändras och slår igenom  | **33 s**                                                           |
| **Påverkar**   | En specifik funktion för användarna                     | Potentiellt hela releasen                                          |
| **Passar när** | Felet är isolerat till en funktion som styrs av flaggan | När en ny deploy orsakar problem och orsaken inte snabbt kan lösas |
| **Exempel**    | Norway-feature fungerar inte korrekt                    | En ny version har ett bredare fel                                  |

En feature flag passar alltså när problemet är isolerat till en funktion och funktionen kan stängas av.

Rollback passar när problemet är kopplat till själva releasen eller när man behöver återgå till en tidigare fungerande version.

---

# Slutsats

Vi uppskattar en möjlig topplast till cirka **1 000 API-anrop per minut**, vilket motsvarar cirka **17 req/s**.

Våra lokala tester gav:

* **42 337 req/s** för GET `/`
* **47 478 req/s** för en statisk JavaScript-fil
* **2 141 req/s** för GET `/api/user` i Docker
* **204 req/s** mot staging med 10 samtidiga anslutningar

Den viktigaste begränsningen i tolkningen är att de lokala testerna inte är produktionsmätningar.

Därför använder vi resultaten för att förstå applikationens beteende och identifiera möjliga flaskhalsar, men vi använder inte resultaten för att lova en viss produktionskapacitet.

För att kunna bedöma produktionskapaciteten behöver vi längre tester och mätningar från den faktiska driftmiljön, särskilt för backend-API:t.
````

## Identifierad flaskhals och åtgärd

### Flaskhals

Den tydligaste begränsningen i våra tester är inte den statiska frontendens kapacitet. De statiska anropen klarade över 42 000 req/s lokalt.

API-anropet `/api/user` hade däremot betydligt lägre genomströmning:

- cirka **2 141 req/s**
- p99 latency **50 ms**
- genomsnittlig latency **22,83 ms**
- maximal latency **154 ms**

Det är därför API-lagret som är den mest relevanta delen att följa vid fortsatt belastning.

Staging-testet gav cirka **204 req/s** med p99 på **68 ms**, vilket visar att nätverk och hostingmiljö påverkar resultatet jämfört med lokal Docker.

### Åtgärd

För M5 har vi fokuserat på att minska onödig belastning från statiska resurser genom cache-headers.

Hashade assets kan cachas länge:

```http
Cache-Control: public, max-age=31536000, immutable
```

Runtime-filer som `index.html`, `config.js` och `version.txt` använder `no-cache` så att nya deploymenter och runtime-konfigurationer kan upptäckas.

Vi använder också samma byggda image genom staging och production i stället för att bygga om applikationen för production.

### Skalningsbeslut

Vår uppskattade topplast är cirka **17 req/s**.

Det är betydligt lägre än de uppmätta resultaten, men de lokala resultaten är inte produktionsgarantier. Därför ska faktisk CPU, minne, latency och fel följas i drift innan en exakt skalningsgräns fastställs.

Vår operativa startpunkt är:

> **CPU över 70 % i minst fem minuter under förväntad topplast.**

Om detta inträffar och svarstider/fel samtidigt ökar bör vi först kontrollera om problemet ligger i API:t eller annan backend-infrastruktur. Vid fortsatt hög belastning kan horisontell skalning med flera instanser användas.
