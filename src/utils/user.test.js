import { it, expect } from "vitest";
import { firstName } from "./user";

it("returns the name when there is only one word", () => {
  const result = firstName("Anna");

  expect(result).toBe("Anna");
});
