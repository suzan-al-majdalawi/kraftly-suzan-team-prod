// src/components/NorwayNotice.test.js
import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/vue";
import NorwayNotice from "../components/NorwayNotice.vue";

describe("NorwayNotice", () => {
  afterEach(() => {
    delete window.__KRAFTLY__;
  });

  it("syns inte när flaggan är av", () => {
    window.__KRAFTLY__ = { env: "production", features: { norway: false } };
    render(NorwayNotice);
    expect(screen.queryByTestId("norway-notice")).not;
  });

  it("syns när flaggan är på", () => {
    window.__KRAFTLY__ = { env: "staging", features: { norway: true } };
    render(NorwayNotice);
    expect(screen.getByTestId("norway-notice"));
  });
});
