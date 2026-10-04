import { describe, it, expect } from "vitest";
import { validateMove } from "./validateMove";

describe("validateMove", () => {
  const today = new Date("2026-09-01T12:00:00");

  const valid = {
    address: "Solvägen 12",
    zip: "80267",
    city: "Gävle",
    date: "2026-09-15",
    contract: "Rörligt pris",
  };

  it("returnerar tomt objekt när alla fält är giltiga", () => {
    expect(validateMove(valid, today)).toEqual({});
  });

  it("ger fel om adress saknas", () => {
    expect(validateMove({ ...valid, address: "" }, today)).toEqual({
      address: "Adress måste fyllas i",
    });
  });

  it("ger fel om postnummer saknas", () => {
    expect(validateMove({ ...valid, zip: "" }, today)).toEqual({
      zip: "Postnummer måste fyllas i",
    });
  });

  it("ger fel om postnummer inte är exakt fem siffror", () => {
    expect(validateMove({ ...valid, zip: "802 67" }, today)).toEqual({
      zip: "Postnummer ska vara fem siffror",
    });
  });

  it("godkänner postnummer med exakt fem siffror", () => {
    expect(validateMove({ ...valid, zip: "12345" }, today)).not.toHaveProperty(
      "zip",
    );
  });

  it("ger fel om stad saknas", () => {
    expect(validateMove({ ...valid, city: "" }, today)).toEqual({
      city: "Ort måste fyllas i",
    });
  });

  it("ger fel om datum saknas", () => {
    expect(validateMove({ ...valid, date: "" }, today)).toEqual({
      date: "Datum måste fyllas i",
    });
  });

  it("ger fel om datum har fel format", () => {
    expect(validateMove({ ...valid, date: "2026-9-15" }, today)).toEqual({
      date: "Datum ska vara i formatet ÅÅÅÅ-MM-DD",
    });
  });

  it("ger fel om datum inte är minst 14 dagar fram", () => {
    expect(validateMove({ ...valid, date: "2026-09-14" }, today)).toEqual({
      date: "Anmälan måste göras senast 14 dagar före flytt",
    });
  });

  it("godkänner exakt 14 dagar fram", () => {
    expect(
      validateMove({ ...valid, date: "2026-09-15" }, today),
    ).not.toHaveProperty("date");
  });

  it("ger fel om datum är 13 dagar fram", () => {
    expect(
      validateMove({ ...valid, date: "2026-09-14" }, today),
    ).toHaveProperty("date");
  });

  it("ger fel om avtal saknas", () => {
    expect(validateMove({ ...valid, contract: "" }, today)).toEqual({
      contract: "Avtal måste väljas",
    });
  });

  it("kan returnera flera fel samtidigt", () => {
    expect(
      validateMove(
        {
          address: "",
          zip: "123",
          city: "",
          date: "",
          contract: "",
        },
        today,
      ),
    ).toEqual({
      address: "Adress måste fyllas i",
      zip: "Postnummer ska vara fem siffror",
      city: "Ort måste fyllas i",
      date: "Datum måste fyllas i",
      contract: "Avtal måste väljas",
    });
  });
});
