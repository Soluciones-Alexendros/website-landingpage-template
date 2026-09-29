# Guía de desarrollo

### Propósito de este documento

- **Objetivos:** Setup local y comandos habituales sin reescribir el README.
- **Estructura:** Requisitos → arranque → scripts → reglas de contenido.
- **Contenido a integrar según contexto:** Adapta pnpm, Node 22 y el monorepo de esta plantilla. No copies un flujo npm de un repo de un solo paquete.

## Requisitos

- Node **22** (`.nvmrc` / `engines.node`)
- pnpm (ver `packageManager` en `package.json`)

```bash
pnpm install
cp apps/landing/.env.example apps/landing/.env.local
pnpm dev            # http://localhost:3000
```

Sin variables, la app arranca con `DB_DRIVER=memory` y email simulado por consola.

## Scripts

| Comando                                                  | Job CI         | Qué hace                                   |
| -------------------------------------------------------- | -------------- | ------------------------------------------ |
| `pnpm format:check` / `lint` / `typecheck`               | `quality`      | Prettier, ESLint, tsc                      |
| `pnpm test` / `pnpm --filter @landing/web test:coverage` | `test`         | Vitest + umbrales                          |
| `pnpm build`                                             | `build`        | Next.js + artefacto `.next`                |
| `pnpm smoke`                                             | `smoke`        | HTTP 200 en `/`, `/gracias`, `/resultados` |
| `pnpm --filter @landing/web test:e2e`                    | `e2e` (opt-in) | Playwright + axe                           |

## Contenido

Marca y copy viven en `apps/landing/src/config/site.config.ts`. Tokens en `globals.css`. Assets en `apps/landing/public/`. Ver [reutilizacion.md](reutilizacion.md).
