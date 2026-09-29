# ADR 0001 — Alinear al canon P1+P2 (plantilla)

### Propósito de este documento

- **Objetivos:** Registrar por qué esta plantilla adopta los contratos de `repo-standard` sin convertirse en el meta-canon.
- **Estructura:** Contexto → decisión → consecuencias.
- **Contenido a integrar según contexto:** No reutilices este ADR en otro repo: el perfil (P1+P2 template, landing Next.js) es de `website-landingpage-template`.

## Contexto

La flota se homogeneiza con `Iniciativas-Alexendros/repo-standard` (main): nombres de jobs, Renovate, docs contractuales y meta-sección «Propósito». Este repo es la **plantilla de landing**, no el esqueleto meta. Ya tenía CI monolítico (`quality` + `e2e` required) y Dependabot version-updates.

`repo-standard` no era accesible (404) al aplicar esta decisión; se usó el contrato resumido P0+P1+P2 de la oleada.

## Decisión

- Perfil **P1+P2 template** (`website-landingpage-template`). Sigue siendo plantilla de landing.
- Conservar `LICENSE`, copy de ejemplo (Nimbus), motor A/B y APIs.
- CI: jobs `quality`, `test`, `build`, `smoke`. e2e **opt-in** (o no-required).
- Sustituir Dependabot version-updates por Renovate (`npm` + `github-actions`).
- Añadir CoC, SUPPORT, AGENTS, ARCHITECTURE y ADRs bajo `docs/architecture/decisions/`.
- Meta-sección **Propósito de este documento** en markdowns contractuales.

## Consecuencias

- Los PRs rutinarios ya no instalan Playwright por defecto (menos minutos, menos flakiness).
- a11y se pide explícitamente (label `e2e`) cuando el cambio toca UI.
- Este repo no publica el contrato de flota: eso vive en `repo-standard` cuando exista.
