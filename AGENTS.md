# AGENTS.md

### Propósito de este documento

- **Objetivos:** Contrato operativo para agentes de código y el rol Mantenedor: fuentes de verdad, autonomía y Definition of Done de esta **plantilla de landing**.
- **Estructura:** Destinatarios → fuentes de verdad → unidad de trabajo → autonomía → stack y comandos → convenciones → layout → Definition of Done.
- **Contenido a integrar según contexto:** Adapta monorepo pnpm/Turborepo, `site.config.ts` y umbrales de cobertura de esta plantilla. No copies un `AGENTS.md` de SaaS, CLI o portfolio. **Este repo no es el meta-canon** (`repo-standard`); sigue siendo `website-landingpage-template`.

**Destinatarios:** agentes de código y el rol Mantenedor. Homogeneizamos **nombres y contratos** (jobs `quality` / `test` / `build` / `smoke`), no el copy ni el motor A/B.

## Fuentes de verdad (orden)

1. [README.md](./README.md) — uso de la plantilla y reutilización
2. Este archivo
3. [ARCHITECTURE.md](./ARCHITECTURE.md)
4. [docs/architecture/decisions/](./docs/architecture/decisions/) — ADRs; el stub [`DECISIONS.md`](./DECISIONS.md) apunta aquí
5. [CONTRIBUTING.md](./CONTRIBUTING.md)
6. [SECURITY.md](./SECURITY.md)

No reinventes requisitos. Si falta ancla, paras y preguntas.

## Unidad de trabajo

```
Objetivo: <resultado verificable>
Traza: <ADR / issue / contrato>
Alcance: <archivos>
Exclusiones: <qué no harás>
Pruebas: pnpm test / pnpm smoke / pnpm test:e2e (opt-in)
Criterio de cierre: CI quality + test + build + smoke verdes
```

Una sesión = una unidad cohesiva. PR pequeño. Mensajes al humano y commits en español (Conventional Commits).

## Autonomía

**Puedes sin preguntar**

- Tests que fijan comportamiento ya aceptado
- Corregir lint/format/typecheck causados por tu cambio
- Docs de guía/runbook en español
- Cambios de marca/contenido en `apps/landing/src/config/site.config.ts`, tokens de `globals.css` y assets de `/public`

**Requiere confirmación**

- Tocar el motor A/B (`src/lib/ab/`, `src/middleware.ts`)
- Cambiar contratos de `/api/contact` o `/api/track-event`
- Dependencia runtime nueva
- Activar el driver `postgres` en producción
- Cambiar org settings o branch protection

## Stack y comandos

- Node 22 (`.nvmrc`), pnpm workspaces + Turborepo, Next.js App Router, TypeScript estricto, Tailwind v4, Vitest, Playwright
- Coverage gate (Vitest, `@landing/web`): statements/lines **85 %**, functions **90 %**, branches **75 %** — por encima del mínimo de flota **≥ 70 %**

```bash
pnpm install
pnpm format:check && pnpm lint && pnpm typecheck
pnpm test && pnpm --filter @landing/web test:coverage
pnpm build && pnpm smoke
pnpm --filter @landing/web test:e2e   # opt-in
```

CI principal (`.github/workflows/ci.yml`): jobs `quality`, `test`, `build`, `smoke`. e2e es **opt-in** (label `e2e` o `workflow_dispatch`).

## Convenciones

- Ramas `feat/` `fix/` `docs/` `chore/` (los agentes Cloud usan `cursor/…`)
- Idioma: README/CONTRIBUTING/docs de guía en español
- No commitees `.env`, `coverage/`, `.next/`, secretos ni credenciales
- Contenido/marca: solo `site.config.ts`, tokens y `/public` (ver `docs/guides/reutilizacion.md`)

## Layout

```
apps/landing    Next.js — config, A/B, APIs, secciones
packages/ui     componentes shadcn reutilizables
docs/           architecture/, guides/, runbooks/
scripts/        smoke.sh
```

## Definition of Done

- Criterios de la traza cumplidos
- Jobs `quality`, `test`, `build` y `smoke` verdes
- Docs canónicos actualizados si cambia el contrato
- Sin secretos en el diff
