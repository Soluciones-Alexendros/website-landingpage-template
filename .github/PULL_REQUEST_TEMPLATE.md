<!-- canon-managed: true -->

### Propósito de este documento

- **Objetivos:** Plantilla de PR para describir el cambio y exigir las comprobaciones `quality` / `test` / `build` / `smoke`.
- **Estructura:** Qué → por qué → cómo probar → checklist CI y contratos → notas.
- **Contenido a integrar según contexto:** Adapta el checklist a scripts pnpm de esta plantilla Next.js. e2e es opt-in (label `e2e` o `workflow_dispatch`). No pegues secretos.

## Qué

Resume en una o dos frases qué cambia este pull request.

## Por qué

Explica el motivo. Si cierra un issue, indica `Cierra #N`.

## Cómo probar

Pasos verificables para revisar manualmente:

1.
2.
3.

## Capturas (si afecta a UI)

<!-- pega capturas o gifs antes / después -->

## Lista de comprobación

- [ ] `pnpm format:check && pnpm lint && pnpm typecheck`
- [ ] `pnpm test && pnpm build && pnpm smoke`
- [ ] Se han añadido o ajustado tests cuando aplica
- [ ] La documentación pertinente (README, docs/) está actualizada
- [ ] El `CHANGELOG.md` recoge el cambio en `[Sin publicar]`
- [ ] No se introducen secretos ni credenciales
- [ ] CI `quality` / `test` / `build` / `smoke` en verde
- [ ] e2e solo si el PR toca UI/a11y y lleva label `e2e` (opt-in)

## Notas para revisión

<!-- consideraciones especiales para quien revise -->
