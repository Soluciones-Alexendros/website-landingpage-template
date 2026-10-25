import { describe, expect, it } from "vitest";

import { leadSchema, trackEventSchema } from "./validation";

describe("leadSchema", () => {
  it("acepta datos válidos y normaliza email a minúsculas", () => {
    const result = leadSchema.safeParse({
      name: "Ada Lovelace",
      email: "Ada@Example.COM",
      company: "Analytical Engines",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("rechaza email inválido", () => {
    const result = leadSchema.safeParse({ name: "Ada", email: "no-es-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("email"))).toBe(true);
    }
  });

  it("rechaza nombre demasiado corto", () => {
    const result = leadSchema.safeParse({ name: "A", email: "ada@example.com" });
    expect(result.success).toBe(false);
  });

  it("rechaza mensaje que excede el máximo", () => {
    const result = leadSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      message: "x".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("acepta variante A/B opcional", () => {
    const result = leadSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      variant: "B",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza nombre ausente con mensaje en español", () => {
    const result = leadSchema.safeParse({ email: "ada@example.com" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "El nombre es obligatorio")).toBe(true);
    }
  });

  it("rechaza email ausente con mensaje en español", () => {
    const result = leadSchema.safeParse({ name: "Ada" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message === "El email es obligatorio")).toBe(true);
    }
  });
});

describe("trackEventSchema", () => {
  it("acepta un evento válido", () => {
    const result = trackEventSchema.safeParse({ variant: "A", action: "cta_click" });
    expect(result.success).toBe(true);
  });

  it("rechaza variante fuera de A/B", () => {
    const result = trackEventSchema.safeParse({ variant: "C", action: "cta_click" });
    expect(result.success).toBe(false);
  });

  it("rechaza acción vacía", () => {
    const result = trackEventSchema.safeParse({ variant: "A", action: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza meta con más de 20 claves", () => {
    const meta = Object.fromEntries(Array.from({ length: 21 }, (_, i) => [`k${i}`, i]));
    const result = trackEventSchema.safeParse({
      variant: "A",
      action: "cta_click",
      meta,
    });
    expect(result.success).toBe(false);
  });

  it("rechaza meta que supera 2048 bytes", () => {
    const result = trackEventSchema.safeParse({
      variant: "A",
      action: "cta_click",
      meta: { payload: "x".repeat(2100) },
    });
    expect(result.success).toBe(false);
  });
});
