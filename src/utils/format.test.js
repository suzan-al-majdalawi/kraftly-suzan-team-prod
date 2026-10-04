import { it, expect } from "vitest";
import { formatAmount } from "./format";

it("formats 412 kronor", () => {
  const result = formatAmount(412);

  expect(result).toBe("412 kr");
});
