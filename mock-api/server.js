// Simple mock of Kraftly's API.
// Built for the demo -- NOT for production.
// Webbmakarna AB / M & J

// Kraftly API v2:
//   POST /api/v2/auth/login
//   POST /api/v2/auth/refresh
//   GET  /api/v2/user
//   GET  /api/v2/consumption
//   GET  /api/v2/invoices
//   POST /api/v2/move
//   PUT  /api/v2/user

// Testkonton:
//   Anna Andersson
//   anna.andersson@example.com / kraftly-anna
//
//   Bo Bergström
//   bo.bergstrom@example.com / kraftly-bo

const express = require("express");
const crypto = require("node:crypto");

const app = express();

// ---------------------------------------------------------------------------
// Miljövariabler
// ---------------------------------------------------------------------------

try {
  process.loadEnvFile();
} catch {
  // Ingen .env – normalt i container/CI om miljövariabler redan finns.
}

app.use(express.json());

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
// Tillåt bara kända origins.
// Ange gärna CORS_ORIGINS i .env, t.ex.:
// CORS_ORIGINS=http://localhost:5173,http://localhost:3000
// ---------------------------------------------------------------------------

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.get("Origin");

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Api-Key, X-Refresh-Token"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ---------------------------------------------------------------------------
// API-nycklar
//
// Lokalt:
//   API_KEY=abc123
//
// Eller flera:
//   API_KEYS=volt:abc123,ampere:def456
// ---------------------------------------------------------------------------

const keys = new Map(
  (
    process.env.API_KEYS ||
    (process.env.API_KEY ? `lokal:${process.env.API_KEY}` : "")
  )
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.indexOf(":");

      if (separator === -1) {
        return ["", ""];
      }

      const name = entry.slice(0, separator);
      const key = entry.slice(separator + 1);

      return [key, name];
    })
    .filter(([name, key]) => name && key)
);

if (keys.size === 0) {
  console.error(
    "API_KEY eller API_KEYS saknas. Lokalt: kopiera .env.example till .env."
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get("/healthz", (req, res) => {
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Kunder
//
// Viktigt för A01/IDOR-testet:
// Varje kund har sin egen data.
//
// Anna ska aldrig få Bos fakturor eller förbrukning.
// Bo ska aldrig få Annas fakturor eller förbrukning.
// ---------------------------------------------------------------------------

const customers = [
  {
    id: 1,
    name: "Anna Andersson",
    email: "anna.andersson@example.com",
    password: "kraftly-anna",
    address: "Solvägen 12, 802 67 Gävle",
    contract: "Rörligt pris",
    customerNo: "K-104233",

    invoices: [
      {
        id: "F-ANNA-2026-06",
        period: "Juni 2026",
        amount: 412,
        status: "Obetald",
        due: "2026-07-31",
      },
      {
        id: "F-ANNA-2026-05",
        period: "Maj 2026",
        amount: 486,
        status: "Betald",
        due: "2026-06-30",
      },
      {
        id: "F-ANNA-2026-04",
        period: "April 2026",
        amount: 655,
        status: "Betald",
        due: "2026-05-31",
      },
      {
        id: "F-ANNA-2026-03",
        period: "Mars 2026",
        amount: 918,
        status: "Betald",
        due: "2026-04-30",
      },
      {
        id: "F-ANNA-2026-02",
        period: "Februari 2026",
        amount: 1204,
        status: "Betald",
        due: "2026-03-31",
      },
      {
        id: "F-ANNA-2026-01",
        period: "Januari 2026",
        amount: 1345,
        status: "Betald",
        due: "2026-02-28",
      },
    ],

    consumption: {
      unit: "kWh",
      months: [
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Maj",
        "Jun",
      ],
      values: [210, 195, 260, 340, 520, 680, 730, 640, 470, 320, 240, 205],
      pricePerKwh: 1.42,
    },
  },

  {
    id: 2,
    name: "Bo Bergström",
    email: "bo.bergstrom@example.com",
    password: "kraftly-bo",
    address: "Björkvägen 8, 753 21 Uppsala",
    contract: "Fast pris",
    customerNo: "K-208517",

    invoices: [
      {
        id: "F-BO-2026-06",
        period: "Juni 2026",
        amount: 376,
        status: "Obetald",
        due: "2026-07-31",
      },
      {
        id: "F-BO-2026-05",
        period: "Maj 2026",
        amount: 421,
        status: "Betald",
        due: "2026-06-30",
      },
      {
        id: "F-BO-2026-04",
        period: "April 2026",
        amount: 398,
        status: "Betald",
        due: "2026-05-31",
      },
      {
        id: "F-BO-2026-03",
        period: "Mars 2026",
        amount: 512,
        status: "Betald",
        due: "2026-04-30",
      },
      {
        id: "F-BO-2026-02",
        period: "Februari 2026",
        amount: 603,
        status: "Betald",
        due: "2026-03-31",
      },
      {
        id: "F-BO-2026-01",
        period: "Januari 2026",
        amount: 714,
        status: "Betald",
        due: "2026-02-28",
      },
    ],

    consumption: {
      unit: "kWh",
      months: [
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Maj",
        "Jun",
      ],
      values: [180, 170, 220, 290, 410, 540, 590, 510, 390, 275, 210, 185],
      pricePerKwh: 1.42,
    },
  },
];

// ---------------------------------------------------------------------------
// Tokens
//
// accessTokens:
//   token -> customerId
//
// refreshTokens:
//   refreshToken -> customerId
//
// På så sätt vet servern vilken kund som äger en token.
// ---------------------------------------------------------------------------

const accessTokens = new Map();
const refreshTokens = new Map();

// ---------------------------------------------------------------------------
// Hjälpfunktioner
// ---------------------------------------------------------------------------

const createToken = (prefix) => {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(16).toString("hex")}`;
};

const publicCustomer = (customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  address: customer.address,
  contract: customer.contract,
  customerNo: customer.customerNo,
});

const findCustomerByEmail = (email) => {
  return customers.find(
    (customer) =>
      customer.email.toLowerCase() === String(email || "").toLowerCase()
  );
};

// ---------------------------------------------------------------------------
// Hämta kunden från access-token.
//
// VIKTIGT:
// Kunden bestäms av token.
// Vi använder INTE customerNo från URL/query/body för authorization.
// ---------------------------------------------------------------------------

const getCustomerFromAccessToken = (token) => {
  const customerId = accessTokens.get(token);

  if (!customerId) {
    return null;
  }

  return customers.find((customer) => customer.id === customerId) || null;
};

// ---------------------------------------------------------------------------
// API-key middleware
//
// Login och refresh är publika.
// Övriga /api-anrop kräver X-Api-Key.
// ---------------------------------------------------------------------------

app.use("/api", (req, res, next) => {
  if (
    req.path === "/login" ||
    req.path === "/v2/auth/login" ||
    req.path === "/v2/auth/refresh"
  ) {
    return next();
  }

  const client = keys.get(req.get("X-Api-Key"));

  if (!client) {
    console.log(
      `401 ${req.method} ${req.originalUrl} – saknad eller ogiltig nyckel`
    );

    return res.status(401).json({
      error: "Saknad eller ogiltig API-nyckel",
    });
  }

  console.log(`[${client}] ${req.method} ${req.originalUrl}`);

  next();
});

// ---------------------------------------------------------------------------
// Bearer-token middleware
// ---------------------------------------------------------------------------

const requireBearerToken = (req, res, next) => {
  const authHeader = req.get("Authorization") || "";

  const providedToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : "";

  if (!providedToken) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const customer = getCustomerFromAccessToken(providedToken);

  if (!customer) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Spara den autentiserade kunden på requesten.
  //
  // ALL DATA HÄMTAS SEDAN FRÅN req.customer.
  // Detta skyddar mot IDOR.
  req.customer = customer;

  next();
};

// ---------------------------------------------------------------------------
// POST /api/v2/auth/login
// ---------------------------------------------------------------------------

app.post("/api/v2/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  const customer = findCustomerByEmail(email);

  if (!customer || customer.password !== password) {
    return res.status(401).json({
      error: "Fel e-postadress eller lösenord.",
    });
  }

  const accessToken = createToken("mock-access");
  const refreshToken = createToken("mock-refresh");

  accessTokens.set(accessToken, customer.id);
  refreshTokens.set(refreshToken, customer.id);

  return res.json({
    accessToken,
    refreshToken,
  });
});

// ---------------------------------------------------------------------------
// POST /api/v2/auth/refresh
// ---------------------------------------------------------------------------

app.post("/api/v2/auth/refresh", (req, res) => {
  const providedRefreshToken =
    req.body?.refreshToken ||
    req.get("X-Refresh-Token") ||
    req.cookies?.refreshToken;

  if (!providedRefreshToken) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const customerId = refreshTokens.get(providedRefreshToken);

  if (!customerId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Rotera refresh-token.
  refreshTokens.delete(providedRefreshToken);

  const accessToken = createToken("mock-access");
  const refreshToken = createToken("mock-refresh");

  accessTokens.set(accessToken, customer.id);
  refreshTokens.set(refreshToken, customer.id);

  return res.json({
    accessToken,
    refreshToken,
  });
});

// ---------------------------------------------------------------------------
// GET /api/v2/user
// ---------------------------------------------------------------------------

app.get("/api/v2/user", requireBearerToken, (req, res) => {
  res.json(publicCustomer(req.customer));
});

// ---------------------------------------------------------------------------
// GET /api/v2/consumption
// ---------------------------------------------------------------------------

app.get("/api/v2/consumption", requireBearerToken, (req, res) => {
  setTimeout(() => {
    res.json(req.customer.consumption);
  }, 600);
});

// ---------------------------------------------------------------------------
// GET /api/v2/invoices
// ---------------------------------------------------------------------------
//
// IDOR-SKYDD:
//
// Vi använder req.customer som skapades från access-token.
// Vi läser INTE customerNo från req.query.
// Vi litar alltså inte på klientens customerNo.
//
// Detta är viktigt:
//
// FEL:
//   /api/v2/invoices?customerNo=K-208517
//
// RÄTT:
//   Kundens invoices hämtas från kunden som token tillhör.
// ---------------------------------------------------------------------------

app.get("/api/v2/invoices", requireBearerToken, (req, res) => {
  res.json(req.customer.invoices);
});

// ---------------------------------------------------------------------------
// POST /api/v2/move
// ---------------------------------------------------------------------------

app.post("/api/v2/move", requireBearerToken, (req, res) => {
  console.log(
    `Move request from ${req.customer.email}:`,
    req.body
  );

  res.json({
    ok: true,
    ref: "FLYTT-" + Math.floor(Math.random() * 90000 + 10000),
  });
});

// ---------------------------------------------------------------------------
// PUT /api/v2/user
//
// Tillåt bara fält som kunden faktiskt får uppdatera.
// ID, email och customerNo kan inte ändras från klienten.
// ---------------------------------------------------------------------------

app.put("/api/v2/user", requireBearerToken, (req, res) => {
  const allowedFields = [
    "name",
    "address",
    "contract",
  ];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
      req.customer[field] = req.body[field];
    }
  }

  res.json(publicCustomer(req.customer));
});

// ---------------------------------------------------------------------------
// V1
// ---------------------------------------------------------------------------
//
// V1 finns fortfarande kvar för kompatibilitet.
// Bygg ny frontend/integration mot /api/v2/.
// V1 är deprecated och avvecklas 2026-10-13.
// ---------------------------------------------------------------------------

const addDeprecationHeaders = (res) => {
  res.setHeader("Deprecation", "true");
  res.setHeader("Sunset", "2026-10-13");
};

// ---------------------------------------------------------------------------
// V1 login
// ---------------------------------------------------------------------------

app.post("/api/login", (req, res) => {
  addDeprecationHeaders(res);

  const { email, password } = req.body || {};
  const customer = findCustomerByEmail(email);

  if (!customer || customer.password !== password) {
    return res.status(401).json({
      error: "Fel e-postadress eller lösenord.",
    });
  }

  const accessToken = createToken("mock-access");
  const refreshToken = createToken("mock-refresh");

  accessTokens.set(accessToken, customer.id);
  refreshTokens.set(refreshToken, customer.id);

  return res.json({
    token: accessToken,
    name: customer.name,
  });
});

// ---------------------------------------------------------------------------
// V1 user
// ---------------------------------------------------------------------------

app.get("/api/user", requireBearerToken, (req, res) => {
  addDeprecationHeaders(res);

  res.json(publicCustomer(req.customer));
});

// ---------------------------------------------------------------------------
// V1 consumption
// ---------------------------------------------------------------------------

app.get("/api/consumption", requireBearerToken, (req, res) => {
  addDeprecationHeaders(res);

  setTimeout(() => {
    res.json(req.customer.consumption);
  }, 600);
});

// ---------------------------------------------------------------------------
// V1 invoices
// ---------------------------------------------------------------------------

app.get("/api/invoices", requireBearerToken, (req, res) => {
  addDeprecationHeaders(res);

  res.json(req.customer.invoices);
});

// ---------------------------------------------------------------------------
// V1 move
// ---------------------------------------------------------------------------

app.post("/api/move", requireBearerToken, (req, res) => {
  addDeprecationHeaders(res);

  console.log(
    `Deprecated move request from ${req.customer.email}:`,
    req.body
  );

  res.json({
    ok: true,
    ref: "FLYTT-" + Math.floor(Math.random() * 90000 + 10000),
  });
});

// ---------------------------------------------------------------------------
// V1 update user
// ---------------------------------------------------------------------------

app.put("/api/user", requireBearerToken, (req, res) => {
  addDeprecationHeaders(res);

  const allowedFields = [
    "name",
    "address",
    "contract",
  ];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
      req.customer[field] = req.body[field];
    }
  }

  res.json(publicCustomer(req.customer));
});

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(
    `Kraftly mock API on port ${port} – ${keys.size} API-nyckel/nycklar laddade`
  );
});