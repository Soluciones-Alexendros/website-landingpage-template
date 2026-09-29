# Guía de calidad

### Propósito de este documento

- **Objetivos:** Declarar gates de calidad de esta plantilla y el mínimo de flota.
- **Estructura:** Jobs CI → cobertura → a11y opt-in → lo que no se mide aquí.
- **Contenido a integrar según contexto:** Adapta umbrales Vitest de `@landing/web`. No copies gates de CLI (tokens/DS) ni de un SaaS. e2e no es required.

## Jobs (canon)

1. **quality** — `format:check`, `lint`, `typecheck`
2. **test** — Vitest + gate de cobertura
3. **build** — `pnpm build` + artefacto `apps/landing/.next`
4. **smoke** — `scripts/smoke.sh` (BUILD_ID + HTTP 200)
5. **e2e** — opt-in: Playwright + axe-core (label `e2e` o `workflow_dispatch`)

## Cobertura

Mínimo de flota: **≥ 70 %** (statements/functions/lines/branches).

Este repo publica umbrales en `apps/landing/vitest.config.ts`:

| Métrica    | Umbral |
| ---------- | ------ |
| statements | 85 %   |
| lines      | 85 %   |
| functions  | 90 %   |
| branches   | 75 %   |

No bajes el gate por debajo del mínimo de flota. El alcance del reporter es `src/lib/**` y `src/components/ab/**`.

## Accesibilidad

Playwright + axe-core cubren landing, a11y y viewport. El job `e2e` **no bloquea** PRs por defecto. Actívalo con label `e2e` o `workflow_dispatch` si el cambio toca UI o a11y.
