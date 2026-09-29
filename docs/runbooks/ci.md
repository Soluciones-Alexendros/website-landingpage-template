# Runbook — CI

### Propósito de este documento

- **Objetivos:** Operar el pipeline y Renovate sin tocar org settings ni branch protection.
- **Estructura:** CI principal → e2e opt-in → Renovate → incidentes.
- **Contenido a integrar según contexto:** Adapta nombres de jobs de esta plantilla pnpm/Next.js. No copies husky/npm de webconfig. No cambies org settings ni branch protection desde un PR.

## CI principal

Workflow: `.github/workflows/ci.yml`.

| Job       | Bloquea PR  | Notas                                            |
| --------- | ----------- | ------------------------------------------------ |
| `quality` | Sí          | format + lint + typecheck                        |
| `test`    | Sí          | Vitest + cobertura                               |
| `build`   | Sí          | Artefacto `next-build` (`.next`)                 |
| `smoke`   | Sí          | Depende de `build`                               |
| `e2e`     | No (opt-in) | Label `e2e` o input `e2e` en `workflow_dispatch` |

El job `e2e` **siempre reporta** un check (éxito en skip) para no dejar un required check colgado si la protección de `main` aún lista `e2e`. Playwright solo corre cuando se pide.

## Renovate

`.github/renovate.json` cubre `npm` y `github-actions`. No hay Dependabot de version-updates. Majors van con label `breaking-change` y sin automerge.

## Si CI falla

1. Reproduce el job en local (`pnpm format:check`, `lint`, `typecheck`, `test`, `build`, `smoke`).
2. `smoke` exige `apps/landing/.next` (tras `pnpm build`).
3. No force-push a `main`. No toques org settings.
