import { beforeEach, describe, expect, it } from "vitest";

import { __resetRateLimit } from "@/lib/rate-limit";

import { POST } from "./route";

beforeEach(() => __resetRateLimit());

function postRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost",
      origin: "http://localhost",
      // IP única por test para no agotar el rate-limit entre casos
      "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250) + 1}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("rechaza con 403 si el origen no coincide", async () => {
    const res = await POST(
      postRequest({ name: "Ada", email: "a@b.com" }, { origin: "http://evil.com" }),
    );
    expect(res.status).toBe(403);
  });

  it("devuelve 422 con datos inválidos", async () => {
    const res = await POST(postRequest({ name: "A", email: "no-es-email" }));
    expect(res.status).toBe(422);
    const json = (await res.json()) as { error: string; issues: unknown };
    expect(json.error).toBe("Datos inválidos");
    expect(json.issues).toBeTruthy();
  });

  it("devuelve 422 si el cuerpo es un array", async () => {
    const res = await POST(postRequest([]));
    expect(res.status).toBe(422);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("Datos inválidos");
  });

  it("crea el lead si llega un campo array desconocido", async () => {
    const res = await POST(
      postRequest({ name: "Ada Lovelace", email: "ada@example.com", tags: ["uno"] }),
    );
    expect(res.status).toBe(201);
  });

  it("devuelve 400 con JSON inválido", async () => {
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { host: "localhost", origin: "http://localhost" },
        body: "{",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("descarta el spam del honeypot con 200 sin persistir", async () => {
    const res = await POST(
      postRequest({ name: "Ada Lovelace", email: "ada@example.com", website: "bot" }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { id?: string };
    expect(json.id).toBeUndefined();
  });

  it("crea el lead y devuelve 201 con datos válidos", async () => {
    const res = await POST(postRequest({ name: "Ada Lovelace", email: "ada@example.com" }));
    expect(res.status).toBe(201);
    const json = (await res.json()) as { ok: boolean; id: string };
    expect(json.ok).toBe(true);
    expect(json.id).toBeTruthy();
  });

  it("aplica rate-limit (429) tras superar el umbral", async () => {
    const ip = "10.1.1.1";
    let last = 200;
    for (let i = 0; i < 7; i += 1) {
      const res = await POST(
        postRequest({ name: "Ada Lovelace", email: "ada@example.com" }, { "x-forwarded-for": ip }),
      );
      last = res.status;
    }
    expect(last).toBe(429);
  });
});
