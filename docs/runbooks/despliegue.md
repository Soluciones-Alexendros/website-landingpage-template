# Runbook — Despliegue

### Propósito de este documento

- **Objetivos:** Desplegar la plantilla en Vercel y activar persistencia cuando toque.
- **Estructura:** Proyecto Vercel → variables → A/B → Postgres → Lighthouse.
- **Contenido a integrar según contexto:** Adapta Root Directory `apps/landing` y el driver memory/postgres. No copies el deploy de un Astro estático ni de un SaaS.

## Vercel (monorepo)

Desplegado en producción: **https://landing-ab-testing.vercel.app** (equipo `alexendros-team`, sin dominio propio).

Configuración del proyecto en Vercel:

1. **Importa** el repo `Iniciativas-Alexendros/website-landingpage-template`.
2. **Root Directory**: `apps/landing` — **imprescindible**: Vercel detecta Next.js en el `package.json` de la Root Directory, y `next` vive en `apps/landing`, no en la raíz del monorepo. Con esto, install (workspace pnpm), build (`next build`) y output (`.next`) usan los valores por defecto; no hace falta `vercel.json`. Vercel resuelve `packages/ui` automáticamente al detectar el workspace pnpm/Turborepo.
3. Framework: Next.js (autodetectado).
4. **Variables de entorno** (Settings → Environment Variables):

   | Variable                      | Necesaria     | Notas                                           |
   | ----------------------------- | ------------- | ----------------------------------------------- |
   | `NEXT_PUBLIC_BASE_URL`        | sí            | URL pública del sitio                           |
   | `EDGE_CONFIG`                 | A/B override  | Cadena de conexión de Edge Config (server-only) |
   | `RESEND_API_KEY`              | email real    | Sin ella, el email se simula                    |
   | `RESEND_FROM`                 | opcional      | Remitente del correo                            |
   | `DB_DRIVER`                   | sí            | `memory` (actual) o `postgres` (ver abajo)      |
   | `DATABASE_URL` / `DIRECT_URL` | solo Postgres | Ver «Activar Postgres»                          |

   Los secretos se gestionan con `pass-cli` (skill `protonpass`); nunca se hardcodean.

5. **Edge Config**: crea un store en Vercel, añade la clave `abVariant` (`"A"` o `"B"`) para forzar variante, y vincula el store al proyecto (genera `EDGE_CONFIG`). Si no se define, el motor A/B cae a la cookie.

## A/B sin parpadeo

El middleware (`src/middleware.ts`) asigna la cookie `ab_variant` en la primera visita; el servidor la lee antes de renderizar (sin parpadeo). El override de Edge Config permite cambiar el CTA al instante **sin redeploy**, respetando la cookie cuando no hay override.

## Activar Postgres (pendiente de infraestructura)

> **Estado actual:** la persistencia usa el driver in-memory. El Supabase autoalojado del operador está **preparado pero no desplegado** (`infra-stacks`). Mientras tanto, los leads y eventos viven en memoria del proceso.

Cuando el servicio Postgres/Supabase esté disponible en Coolify:

1. **Instala el cliente Prisma** en `apps/landing`:
   ```bash
   pnpm --filter @landing/web add @prisma/client @prisma/adapter-pg pg
   pnpm --filter @landing/web add -D prisma
   ```
2. **Genera el cliente** desde el esquema existente (`apps/landing/prisma/schema.prisma`):
   ```bash
   pnpm --filter @landing/web exec prisma generate
   ```
3. **Implementa el driver** `postgres` en `apps/landing/src/lib/db/` (interfaz ya definida en `repo.ts`):
   - Crea `prisma.ts` con el singleton `PrismaClient` + `PrismaPg` adapter (patrón null-safe).
   - Crea `postgres.ts` con `createPostgresRepo()` implementando `LeadRepo`/`EventRepo` sobre Prisma.
   - En `index.ts`, sustituye el `throw` del caso `"postgres"` por `createPostgresRepo()`.
4. **Multi-instancia (un cliente por landing)**: usa un esquema por cliente en la misma base:
   ```
   DATABASE_URL=postgres://USER:PASS@SUPAVISOR:4000/postgres?pgbouncer=true&schema=cliente_x
   DIRECT_URL=postgres://USER:PASS@HOST:5432/postgres?schema=cliente_x
   ```
5. **Migra**:
   ```bash
   pnpm --filter @landing/web exec prisma migrate deploy
   ```
6. En Vercel, define `DB_DRIVER=postgres` + `DATABASE_URL` + `DIRECT_URL`.

## Lighthouse

```bash
pnpm --filter @landing/web build
pnpm dlx @lhci/cli autorun --config=apps/landing/lighthouserc.json
```

Objetivos: Performance ≥ 95, Accesibilidad ≥ 90, Best Practices ≥ 90 (ver `lighthouserc.json`). En CI compartido los scores de Performance pueden variar; la referencia fiable es el preview de Vercel.
