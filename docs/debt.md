**Problem som uppstår i koden**

### 1. Autentiseringen går att kringgå

- Api-nyckeln ligger i `api.js` och är tillgänglig direkt i koden, vilket kan innebära en säkerhetsrisk.
- **Var:** `src/services/api.js`

### 2. Ingen validering av e-postfältet i ProfileView

- E-postfältet är av typen `text` istället för `email`.
- `save()` kontrollerar inte att det som skrivs in är en giltig e-postadress.
- **Var:** `src/views/ProfileView.vue`, rad 10

### 3. Inga labels på formulärfälten

- Inputfälten för namn, e-post och adress saknar `<label>`-element och placeholder-text.
- Användaren kan därför ha svårt att förstå vad som ska fyllas i.
- **Var:** `src/views/ProfileView.vue`, rad 9–11

### 4. Inloggningen är bara en mock

- Login-flödet skickar e-post och lösenord, men mock-API:t kontrollerar inte om uppgifterna är korrekta.
- API:t returnerar alltid en fejkad token.
- **Var:** `src/services/api.js`

### 5. Ingen validering av e-postfältet i MoveFormView

- Flyttanmälningsformuläret saknar validering.
- Det finns dessutom en `// TODO validation`-kommentar.
- Det går därför att skicka in tomma fält eller ogiltiga datum.
- **Var:** `src/views/MoveFormView.vue`
