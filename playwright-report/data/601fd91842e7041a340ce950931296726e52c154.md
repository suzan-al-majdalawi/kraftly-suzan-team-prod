# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.js >> API >> logs in a user without Bearer token
- Location: e2e\api.spec.js:46:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 429
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | const API_URL =
  4   |   process.env.API_URL || 'http://localhost:4000'
  5   | 
  6   | const API_KEY =
  7   |   process.env.API_KEY || 'lokal-utvecklingsnyckel'
  8   | 
  9   | const TEST_EMAIL =
  10  |   process.env.TEST_EMAIL || 'anna.andersson@example.com'
  11  | 
  12  | const TEST_PASSWORD =
  13  |   process.env.TEST_PASSWORD || 'kraftly-anna'
  14  | 
  15  | test.describe('API', () => {
  16  |   let accessToken
  17  | 
  18  |   test.beforeAll(async ({ request }) => {
  19  |     const response = await request.post(
  20  |       `${API_URL}/api/v2/auth/login`,
  21  |       {
  22  |         data: {
  23  |           email: TEST_EMAIL,
  24  |           password: TEST_PASSWORD,
  25  |         },
  26  |       }
  27  |     )
  28  | 
  29  |     console.log('LOGIN STATUS:', response.status())
  30  |     console.log('LOGIN BODY:', await response.text())
  31  | 
> 32  |     expect(response.status()).toBe(200)
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  33  | 
  34  |     const body = await response.json()
  35  | 
  36  |     expect(body).toHaveProperty('accessToken')
  37  | 
  38  |     accessToken = body.accessToken
  39  |   })
  40  | 
  41  |   const authenticatedHeaders = () => ({
  42  |     'X-Api-Key': API_KEY,
  43  |     Authorization: `Bearer ${accessToken}`,
  44  |   })
  45  | 
  46  |   test('logs in a user without Bearer token', async ({ request }) => {
  47  |     const response = await request.post(
  48  |       `${API_URL}/api/v2/auth/login`,
  49  |       {
  50  |         data: {
  51  |           email: TEST_EMAIL,
  52  |           password: TEST_PASSWORD,
  53  |         },
  54  |       }
  55  |     )
  56  | 
  57  |     expect(response.status()).toBe(200)
  58  | 
  59  |     const body = await response.json()
  60  | 
  61  |     expect(body).toHaveProperty('accessToken')
  62  |   })
  63  | 
  64  |   test('fetches the user with Bearer token', async ({ request }) => {
  65  |     const response = await request.get(
  66  |       `${API_URL}/api/v2/user`,
  67  |       {
  68  |         headers: authenticatedHeaders(),
  69  |       }
  70  |     )
  71  | 
  72  |     expect(response.status()).toBe(200)
  73  | 
  74  |     const user = await response.json()
  75  | 
  76  |     expect(user).toBeDefined()
  77  |   })
  78  | 
  79  |   test('fetches consumption', async ({ request }) => {
  80  |     const response = await request.get(
  81  |       `${API_URL}/api/v2/consumption`,
  82  |       {
  83  |         headers: authenticatedHeaders(),
  84  |       }
  85  |     )
  86  | 
  87  |     expect(response.status()).toBe(200)
  88  | 
  89  |     const consumption = await response.json()
  90  | 
  91  |     expect(consumption).toBeDefined()
  92  |   })
  93  | 
  94  |   test('fetches invoices', async ({ request }) => {
  95  |     const response = await request.get(
  96  |       `${API_URL}/api/v2/invoices`,
  97  |       {
  98  |         headers: authenticatedHeaders(),
  99  |       }
  100 |     )
  101 | 
  102 |     expect(response.status()).toBe(200)
  103 | 
  104 |     const invoices = await response.json()
  105 | 
  106 |     expect(invoices).toBeDefined()
  107 |   })
  108 | 
  109 |   test('rejects requests without token', async ({ request }) => {
  110 |     const response = await request.get(
  111 |       `${API_URL}/api/v2/invoices`,
  112 |       {
  113 |         headers: {
  114 |           'X-Api-Key': API_KEY,
  115 |         },
  116 |       }
  117 |     )
  118 | 
  119 |     expect(response.status()).toBe(401)
  120 |   })
  121 | 
  122 |   test('submits a move request', async ({ request }) => {
  123 |     const moveData = {
  124 |       address: 'Solvägen 12',
  125 |       zip: '802 67',
  126 |       city: 'Gävle',
  127 |       date: '2026-09-01',
  128 |       contract: 'Rörligt pris',
  129 |     }
  130 | 
  131 |     const response = await request.post(
  132 |       `${API_URL}/api/v2/move`,
```