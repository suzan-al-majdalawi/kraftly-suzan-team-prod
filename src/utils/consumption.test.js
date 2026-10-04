import { describe, it, expect } from "vitest";
import { peakMonth, yearlyTotal, vsAverage } from "./consumption";

describe("consumption", () => {
  const months = ["Jan", "Feb", "Mar", "Apr"];
  const values = [730, 500, 600, 400];

  describe("peakMonth", () => {
    it("returnerar månaden med högst förbrukning", () => {
      expect(peakMonth(months, values)).toEqual({
        month: "Jan",
        value: 730,
      });
    });

    it("returnerar null för tom lista", () => {
      expect(peakMonth([], [])).toBeNull();
    });
  });

  describe("yearlyTotal", () => {
    it("summerar förbrukningen", () => {
      expect(yearlyTotal([100, 200, 300])).toBe(600);
    });

    it("returnerar 0 för tom lista", () => {
      expect(yearlyTotal([])).toBe(0);
    });
  });

  describe("vsAverage", () => {
    it("jämför senaste månaden med genomsnittet", () => {
      expect(vsAverage([100, 200, 300])).toBe(50);
    });

    it("returnerar 0 för tom lista", () => {
      expect(vsAverage([])).toBe(0);
    });
  });
});
