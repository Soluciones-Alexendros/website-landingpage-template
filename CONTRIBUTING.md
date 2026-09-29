# Guía de contribución · landing-ab-testing

### Propósito de este documento

- **Objetivos:** Explicar setup, flujo de rama/PR y comprobaciones locales sin romper la plantilla.
- **Estructura:** Idioma → flujo → commits → calidad → reglas.
- **Contenido a integrar según contexto:** Adapta pnpm, Node 22 y jobs `quality`/`test`/`build`/`smoke`. e2e es opt-in. No copies husky/npm de otro paquete.

Idioma: este fichero, README y `docs/guides|runbooks` en español. Commits y PRs en español (Conventional Commits).

Lee también [AGENTS.md](AGENTS.md), [ARCHITECTURE.md](ARCHITECTURE.md) y [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Flujo de trabajo

- `main` está protegida: PR obligatorio, CI verde requerido (`quality`, `test`, `build`, `smoke`), historia lineal, sin force-push.
- Trabaja en una rama por cambio: `feat/…`, `fix/…`, `docs/…`, `chore/…`, `test/…`, `ci/…`.
- Abre un PR contra `main`. Mergea con **squash** cuando el CI canónico esté verde.
- Playwright/axe: label `e2e` si tocas UI o a11y (opt-in).

## Convenciones de commits y PRs

- Título en **Conventional Commits**: `tipo(alcance): descripción`.
  - Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `ci`, `chore`, `build`.
  - Ejemplo: `fix(seguridad): escapa el nombre del lead en el email`.
- Tamaño objetivo del PR: ≤ ~500 líneas. Si una unidad de trabajo excede, pártela.
- Actualiza `CHANGELOG.md` (`[Sin publicar]`) cuando el cambio sea relevante.

## Calidad (antes de abrir el PR)

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @landing/web test:coverage
pnpm build
pnpm smoke
```

Recomendado: instala los hooks de pre-commit (`pip install pre-commit && pre-commit install`).
Incluyen `gitleaks` (escaneo de secretos), Prettier y ESLint.

## Reglas

- Nada de secretos en el repo. Se gestionan vía variables de entorno / `pass-cli`.
- Toda corrección de bug debe llegar con un test que reproduzca el defecto (rojo → verde).
- Cambios de contenido/marca: solo `apps/landing/src/config/site.config.ts`, tokens de
  `globals.css` y assets de `/public` (ver `docs/guides/reutilizacion.md`).
- Vulnerabilidades: [SECURITY.md](SECURITY.md), no un issue público.
- Coverage: Vitest exige 85/90/85/75 en `@landing/web` (mínimo de flota ≥ 70 %). Ver `docs/guides/calidad.md`.
