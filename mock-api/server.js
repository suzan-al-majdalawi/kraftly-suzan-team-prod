// Simple mock of Kraftly's API. Built for the demo -- NOT for production.
// Webbmakarna AB / M & J

const express = require("express");
const app = express();

// Läs .env lokalt om filen finns.
// Node 22 krävs för process.loadEnvFile().
try {
  process.loadEnvFile();
} catch {
  // Ingen .env – normalt i container/CI om miljövariabler redan finns.
}

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// API-nycklar.
// Lokalt räcker API_KEY.
// API_KEYS kan användas för flera klienter:
// "volt:abc123,ampere:def456"
const keys = new Map(
  (
    process.env.API_KEYS ||
    (process.env.API_KEY ? `lokal:${process.env.API_KEY}` : "")
  )
    .split(",")
    .map((entry) => entry.trim())
    .map((entry) => [
      entry.slice(0, entry.indexOf(":")),
      entry.slice(entry.indexOf(":") + 1),
    ])
    .filter(([name, key]) => name && key)
    .map(([name, key]) => [key, name]),
);

if (keys.size === 0) {
  console.error(
    "API_KEY eller API_KEYS saknas. Lokalt: kopiera .env.example till .env.",
  );
  process.exit(1);
}

// Publik health check.
// Den ska INTE kräva API-nyckel.
app.get("/healthz", (req, res) => {
  res.json({ ok: true });
});

// Alla /api-anrop kräver giltig API-nyckel.
app.use("/api", (req, res, next) => {
  const client = keys.get(req.get("X-Api-Key"));

  if (!client) {
    console.log(
      `401 ${req.method} ${req.originalUrl} – saknad eller ogiltig nyckel`,
    );

    return res.status(401).json({
      error: "Saknad eller ogiltig API-nyckel",
    });
  }

  console.log(`[${client}] ${req.method} ${req.originalUrl}`);
  next();
});

const user = {
  id: 1,
  name: "Anna Andersson",
  email: "anna.andersson@example.com",
  address: "Solvägen 12, 802 67 Gävle",
  contract: "Rörligt pris",
  customerNo: "K-104233",
};

const invoices = [
  {
    id: "F-2026-06",
    period: "Juni 2026",
    amount: 412,
    status: "Obetald",
    due: "2026-07-31",
  },
  {
    id: "F-2026-05",
    period: "Maj 2026",
    amount: 486,
    status: "Betald",
    due: "2026-06-30",
  },
  {
    id: "F-2026-04",
    period: "April 2026",
    amount: 655,
    status: "Betald",
    due: "2026-05-31",
  },
  {
    id: "F-2026-03",
    period: "Mars 2026",
    amount: 918,
    status: "Betald",
    due: "2026-04-30",
  },
  {
    id: "F-2026-02",
    period: "Februari 2026",
    amount: 1204,
    status: "Betald",
    due: "2026-03-31",
  },
  {
    id: "F-2026-01",
    period: "Januari 2026",
    amount: 1345,
    status: "Betald",
    due: "2026-02-28",
  },
];

const consumption = {
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
};

app.post("/api/login", (req, res) => {
  res.json({
    token: "fake-token-123",
    name: user.name,
  });
});

app.get("/api/user", (req, res) => {
  res.json(user);
});

app.get("/api/consumption", (req, res) => {
  setTimeout(() => res.json(consumption), 600);
});

app.get("/api/invoices", (req, res) => {
  res.json(invoices);
});

app.post("/api/move", (req, res) => {
  console.log("Move request:", req.body);

  res.json({
    ok: true,
    ref: "FLYTT-" + Math.floor(Math.random() * 90000 + 10000),
  });
});

app.put("/api/user", (req, res) => {
  Object.assign(user, req.body);
  res.json(user);
});

// Plattformen bestämmer PORT.
// Lokalt används 4000.
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Mock API on port ${port} – ${keys.size} nyckel/nycklar laddade`);
});
