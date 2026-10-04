import { it, expect } from "vitest";
import { invoiceStatus } from "./invoice";

it("visar Betald för betald faktura", () => {
  const invoice = {
    status: "Betald",
    due: "2026-07-31",
  };

  const result = invoiceStatus(invoice, new Date(2026, 7, 27, 15, 30));

  expect(result).toBe("Betald");
});

it("visar Förfallen när obetald faktura har passerat förfallodatum", () => {
  const invoice = {
    status: "Obetald",
    due: "2026-07-31",
  };

  const result = invoiceStatus(invoice, new Date(2026, 7, 27, 15, 30));

  expect(result).toBe("Förfallen");
});

it("visar Obetald om fakturan förfaller idag", () => {
  const invoice = {
    status: "Obetald",
    due: "2026-08-27",
  };

  const result = invoiceStatus(invoice, new Date(2026, 7, 27, 15, 30));

  expect(result).toBe("Obetald");
});

it("visar Obetald om förfallodatum är i framtiden", () => {
  const invoice = {
    status: "Obetald",
    due: "2026-09-01",
  };

  const result = invoiceStatus(invoice, new Date(2026, 7, 27, 15, 30));

  expect(result).toBe("Obetald");
});
