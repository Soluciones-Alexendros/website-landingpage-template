# Arquitectura — website-landingpage-template

### Propósito de este documento

- **Objetivos:** Describir capas, fronteras y no-objetivos de esta plantilla de landing (A/B, leads, marca centralizada).
- **Estructura:** Propósito del producto → capas → módulos → calidad → no-objetivos → stack.
- **Contenido a integrar según contexto:** Adapta rutas Next.js y el repository pattern de este repo. No copies la arquitectura de un SaaS, de un portfolio Astro ni de la CLI webconfig. **Este repo no es `repo-standard`**; es la plantilla de landing.

Landing reutilizable: marca y copy viven en `apps/landing/src/config/site.config.ts`. La lógica (A/B, formulario, animaciones, tema) no se toca al clonar para otro cliente.

## 1. Propósito

Entrada: un visitante + cookie `ab_variant` (y override opcional de Edge Config).  
Salida: landing de conversión, lead en `/api/contact`, evento en `/api/track-event`, panel demo en `/resultados`.

## 2. Capas

```
Visitante
    │  middleware (cookie ab_variant)
    ▼
apps/landing (Next.js App Router)
  src/config/site.config.ts    marca + copy
  src/components/sections/     hero, pricing, lead-form…
  src/lib/ab/                  motor A/B
  src/lib/db/                  repository (memory | postgres)
  src/app/api/                 contact, track-event
        │
        ▼
packages/ui                    primitivos shadcn + animaciones
```

## 3. Módulos

| Módulo                    | Responsabilidad                                |
| ------------------------- | ---------------------------------------------- |
| `site.config.ts`          | Única fuente de marca y contenido              |
| `src/middleware.ts`       | Asigna `ab_variant` en la primera visita       |
| `src/lib/ab/`             | Variante A/B + override Edge Config            |
| `src/lib/db/`             | `LeadRepo` / `EventRepo` (memory por defecto)  |
| `src/app/api/contact`     | Zod, honeypot, rate-limit, mismo origen, email |
| `src/app/api/track-event` | Eventos de clic/conversión                     |
| `packages/ui`             | Button, Input, Card… (no lógica de negocio)    |

Persistencia: `DB_DRIVER=memory` **no es apto para producción** (estado por instancia). Postgres queda documentado en `docs/runbooks/despliegue.md`.

## 4. Calidad

- Vitest sobre `apps/landing/src/**/*.{test,spec}.{ts,tsx}` con umbrales 85/90/85/75 (flota ≥ 70 %)
- Playwright + axe-core: **opt-in** (label `e2e`)
- CI: `quality` → `test` → `build` (artefacto `.next`) → `smoke` (`scripts/smoke.sh`)

## 5. No-objetivos

- No convertir este repo en el meta-canon (`repo-standard`)
- No reescribir UI/UX ni el motor A/B en PRs de plataforma
- No secretos en el repo; variables en `.env.example` / Vercel
- No exigir e2e en cada PR

## 6. Stack

Next.js 15+ App Router · React 19 · TypeScript strict · pnpm + Turborepo · Tailwind CSS v4 · shadcn/ui · Framer Motion · Vitest · Playwright · Vercel.

Decisiones de plataforma: [`docs/architecture/decisions/`](docs/architecture/decisions/).
