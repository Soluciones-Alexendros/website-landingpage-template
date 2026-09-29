# landing-ab-testing

### Propósito de este documento

- **Objetivos:** Presentar la plantilla de landing, el stack, el CI canónico y cómo reutilizarla por marca.
- **Estructura:** Identidad → stack → estructura → desarrollo → reutilización → CI → despliegue.
- **Contenido a integrar según contexto:** Adapta `site.config.ts`, badges y env de esta plantilla Next.js. No copies tokens/DS de webconfig ni el alcance de un SaaS. **Este repo no es el meta-canon** (`repo-standard`); sigue siendo plantilla de landing.

Landing page de alto impacto con **A/B testing sobre el CTA**, captura de leads, animaciones, tema claro/oscuro y despliegue en Vercel. **PortfolioSaaS reutilizable**: toda la marca y el contenido se centralizan en `apps/landing/src/config/site.config.ts` — cambiando ese fichero y los assets de `/public` se obtiene una landing nueva para otro cliente sin tocar la lógica.

**Ref:** [ARCHITECTURE](ARCHITECTURE.md) · [AGENTS](AGENTS.md) · [CONTRIBUTING](CONTRIBUTING.md) · [SECURITY](SECURITY.md) · [SUPPORT](SUPPORT.md) · [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) · [docs/](docs/)

## Stack

| Capa       | Tecnología                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------- |
| Monorepo   | pnpm workspaces + Turborepo                                                                 |
| App        | Next.js 15 (App Router, RSC), TypeScript estricto                                           |
| Estilos    | Tailwind CSS v4 (CSS-first) · shadcn/ui · Framer Motion                                     |
| Tipografía | Space Grotesk · Plus Jakarta Sans · JetBrains Mono                                          |
| Datos      | Repository pattern — mock in-memory por defecto; Prisma + Postgres tras la flag `DB_DRIVER` |
| A/B        | Vercel Edge Config (override) + cookie `ab_variant` (middleware)                            |
| Email      | Resend (simulado por consola en desarrollo)                                                 |
| Tests      | Vitest + Testing Library · Playwright + axe-core (opt-in)                                   |
| Deploy     | Vercel + GitHub Actions (jobs `quality` / `test` / `build` / `smoke`)                       |

## Estructura

```
apps/landing      # aplicación Next.js
  src/config/site.config.ts   # ← ÚNICA fuente de marca y contenido
  src/lib/db/                 # repository pattern (driver memory|postgres)
  src/lib/ab/                 # motor de test A/B
  src/middleware.ts           # asignación de variante A/B
packages/ui       # componentes reutilizables (shadcn + animaciones)
docs/             # guides, runbooks, ADRs
```

## Desarrollo

```bash
pnpm install
pnpm dev            # apps/landing en http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test           # unitarios e integración (Vitest)
pnpm build && pnpm smoke
pnpm --filter @landing/web test:e2e   # end-to-end (Playwright, opt-in)
```

Copia `apps/landing/.env.example` a `apps/landing/.env.local` y ajusta lo necesario. Sin variables, la app arranca con el driver de datos **in-memory** y el email simulado por consola.

> ⚠️ **El driver `memory` NO es apto para producción.** En un entorno serverless (Vercel) cada instancia tiene su propia memoria y el estado se pierde entre invocaciones: los leads y eventos **no persisten**. Es solo para desarrollo, tests y demos. Para producción hay que cablear Postgres (ver [despliegue](docs/runbooks/despliegue.md)).

## Reutilizar para otro cliente

Ver **[docs/guides/reutilizacion.md](docs/guides/reutilizacion.md)**. En resumen: edita `apps/landing/src/config/site.config.ts`, reemplaza los assets de `/public` y ajusta los tokens de marca en `apps/landing/src/app/globals.css`. La lógica de A/B, formulario y animaciones no cambia.

## CI

Workflow `.github/workflows/ci.yml`, jobs canónicos:

| Job       | Qué corre                                                       |
| --------- | --------------------------------------------------------------- |
| `quality` | format:check, lint, typecheck                                   |
| `test`    | Vitest + umbrales de cobertura                                  |
| `build`   | Next.js + artefacto `.next`                                     |
| `smoke`   | `scripts/smoke.sh` (HTTP 200 en `/`, `/gracias`, `/resultados`) |
| `e2e`     | Playwright + axe — **opt-in** (label `e2e`)                     |

e2e no bloquea el PR por defecto. Dependencias: Renovate (`.github/renovate.json`); sin Dependabot version-updates.

## Despliegue y base de datos

Ver **[docs/runbooks/despliegue.md](docs/runbooks/despliegue.md)** para el despliegue en Vercel (Edge Config, variables) y para **activar Postgres** cuando el Supabase autoalojado esté disponible. Hasta entonces, la persistencia usa el driver in-memory (`DB_DRIVER=memory`).

## Flujo de trabajo

`main` protegida: **PR obligatorio**, **jobs `quality` + `test` + `build` + `smoke` verdes**, historia lineal, sin force-push. Convenciones en [CONTRIBUTING.md](CONTRIBUTING.md). Cambios notables en [CHANGELOG.md](CHANGELOG.md); seguridad en [SECURITY.md](SECURITY.md).
