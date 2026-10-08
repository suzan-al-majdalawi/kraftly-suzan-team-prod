import { test, expect } from '@playwright/test'

const API_URL =
  process.env.API_URL || 'http://localhost:4000'

const API_KEY =
  process.env.API_KEY || 'lokal-utvecklingsnyckel'

const TEST_EMAIL =
  process.env.TEST_EMAIL || 'anna.andersson@example.com'

const TEST_PASSWORD =
  process.env.TEST_PASSWORD || 'kraftly-anna'

test.describe('API', () => {
  let accessToken

  test.beforeAll(async ({ request }) => {
    const response = await request.post(
      `${API_URL}/api/v2/auth/login`,
      {
        data: {
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        },
      }
    )

    console.log('LOGIN STATUS:', response.status())
    console.log('LOGIN BODY:', await response.text())

    expect(response.status()).toBe(200)

    const body = await response.json()

    expect(body).toHaveProperty('accessToken')

    accessToken = body.accessToken
  })

  const authenticatedHeaders = () => ({
    'X-Api-Key': API_KEY,
    Authorization: `Bearer ${accessToken}`,
  })

  test('logs in a user without Bearer token', async ({ request }) => {
    const response = await request.post(
      `${API_URL}/api/v2/auth/login`,
      {
        data: {
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        },
      }
    )

    expect(response.status()).toBe(200)

    const body = await response.json()

    expect(body).toHaveProperty('accessToken')
  })

  test('fetches the user with Bearer token', async ({ request }) => {
    const response = await request.get(
      `${API_URL}/api/v2/user`,
      {
        headers: authenticatedHeaders(),
      }
    )

    expect(response.status()).toBe(200)

    const user = await response.json()

    expect(user).toBeDefined()
  })

  test('fetches consumption', async ({ request }) => {
    const response = await request.get(
      `${API_URL}/api/v2/consumption`,
      {
        headers: authenticatedHeaders(),
      }
    )

    expect(response.status()).toBe(200)

    const consumption = await response.json()

    expect(consumption).toBeDefined()
  })

  test('fetches invoices', async ({ request }) => {
    const response = await request.get(
      `${API_URL}/api/v2/invoices`,
      {
        headers: authenticatedHeaders(),
      }
    )

    expect(response.status()).toBe(200)

    const invoices = await response.json()

    expect(invoices).toBeDefined()
  })

  test('rejects requests without token', async ({ request }) => {
    const response = await request.get(
      `${API_URL}/api/v2/invoices`,
      {
        headers: {
          'X-Api-Key': API_KEY,
        },
      }
    )

    expect(response.status()).toBe(401)
  })

  test('submits a move request', async ({ request }) => {
    const moveData = {
      address: 'Solvägen 12',
      zip: '802 67',
      city: 'Gävle',
      date: '2026-09-01',
      contract: 'Rörligt pris',
    }

    const response = await request.post(
      `${API_URL}/api/v2/move`,
      {
        headers: authenticatedHeaders(),
        data: moveData,
      }
    )

    expect(response.status()).toBe(200)

    const body = await response.json()

    expect(body).toHaveProperty('ref')
  })

  test('saves the user', async ({ request }) => {
    const userData = {
      name: 'Anna Andersson',
      email: TEST_EMAIL,
      address: 'Solvägen 12',
    }

    const response = await request.put(
      `${API_URL}/api/v2/user`,
      {
        headers: authenticatedHeaders(),
        data: userData,
      }
    )

    expect(response.status()).toBe(200)

    const body = await response.json()

    expect(body).toMatchObject(userData)
  })
})