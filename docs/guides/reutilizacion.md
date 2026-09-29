# Reutilizar la landing para otro cliente

### Propósito de este documento

- **Objetivos:** Explicar cómo clonar la plantilla cambiando datos, no código.
- **Estructura:** Pasos de marca → identidad visual → assets → A/B → verificación → lo que no se toca.
- **Contenido a integrar según contexto:** Conserva `site.config.ts` como única fuente. No copies un CMS ni el alcance de un SaaS.

El objetivo del proyecto es que una landing nueva sea cuestión de **datos, no de código**. Toda la lógica (A/B, formulario, animaciones, tema) permanece intacta.

## Pasos

1. **Contenido y marca** — edita `apps/landing/src/config/site.config.ts`:
   - `brand` (nombre, dominio, email), `seo` (título, descripción, URL canónica, OG).
   - `nav`, `hero` (incluye **`ctaVariants.A` / `ctaVariants.B`** del test A/B), `features`, `pricing`, `testimonials`, `faq`, `finalCta`, `footer`.
   - Los iconos de `features` son nombres de [lucide](https://lucide.dev) (p. ej. `"Zap"`). Si usas uno nuevo, añádelo al mapa en `apps/landing/src/components/icon.tsx`.

2. **Identidad visual** — ajusta los tokens en `apps/landing/src/app/globals.css`:
   - Color de marca: variables `--brand`, `--brand-soft`, `--peach` (formato oklch) en `:root` y `.dark`.
   - Tipografías: cambia las fuentes de `next/font/google` en `apps/landing/src/app/layout.tsx` (`--font-display`, `--font-body`, `--font-mono`).

3. **Assets** — reemplaza imágenes y la OG (`apps/landing/public/`). Actualiza `seo.ogImage`.

4. **Variantes A/B** — el texto del CTA principal sale de `hero.ctaVariants`. Para forzar una variante en producción sin redeploy, define la clave `abVariant` (`"A"` o `"B"`) en **Vercel Edge Config**; tiene prioridad sobre la cookie.

5. **Verifica**:
   ```bash
   pnpm typecheck && pnpm test && pnpm build && pnpm smoke
   ```
   El test `site.config.test.ts` valida invariantes (ambas variantes del CTA presentes y distintas, un único plan destacado, secciones no vacías).

## Qué NO hay que tocar

- Motor A/B (`src/lib/ab/`, `src/middleware.ts`).
- Formulario y validación (`src/components/sections/lead-form.tsx`, `src/lib/validation.ts`).
- APIs (`src/app/api/contact`, `src/app/api/track-event`).
- Animaciones (`src/components/motion/`).
- Paquete de UI (`packages/ui/`) — es genérico y exportable a otros proyectos del monorepo.
