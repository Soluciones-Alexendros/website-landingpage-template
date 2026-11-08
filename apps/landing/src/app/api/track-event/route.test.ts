import { beforeEach, describe, expect, it } from "vitest";

import { __resetRateLimit } from "@/lib/rate-limit";

import { POST } from "./route";

beforeEach(() => __resetRateLimit());

function postRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/track-event", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost",
      origin: "http://localhost",
      "x-forwarded-for": `10.2.0.${Math.floor(Math.random() * 250) + 1}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/track-event", () => {
  it("rechaza con 403 si el origen no coincide", async () => {
    const res = await POST(
      postRequest({ variant: "A", action: "cta_click" }, { origin: "http://evil.com" }),
    );
    expect(res.status).toBe(403);
  });

  it("registra un evento válido (200)", async () => {
    const res = await POST(postRequest({ variant: "A", action: "cta_click" }));
    expect(res.status).toBe(200);
  });

  it("rechaza variante inválida (422)", async () => {
    const res = await POST(postRequest({ variant: "C", action: "cta_click" }));
    expect(res.status).toBe(422);
    const json = (await res.json()) as { error: string; issues: unknown };
    expect(json.error).toBe("Datos inválidos");
    expect(json.issues).toBeTruthy();
  });

  it("rechaza un array en la raíz (422)", async () => {
    const res = await POST(postRequest([]));
    expect(res.status).toBe(422);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("Datos inválidos");
  });

  it("rechaza meta abusivamente grande (422)", async () => {
    const meta: Record<string, string> = {};
    for (let i = 0; i < 50; i += 1) meta[`k${i}`] = "x".repeat(100);
    const res = await POST(postRequest({ variant: "A", action: "cta_click", meta }));
    expect(res.status).toBe(422);
  });
});
