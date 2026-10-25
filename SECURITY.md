# Política de seguridad de landing-ab-testing

### Propósito de este documento

- **Objetivos:** Declarar versiones soportadas, el canal privado de avisos y la superficie (formulario, tracking, PII).
- **Estructura:** Versiones → reporte → SLA → superficie → Renovate.
- **Contenido a integrar según contexto:** Adapta endpoints y env de esta plantilla. No copies la política de un SaaS ni un desk de comunidad. No commitees `.env` ni claves.

## Versiones soportadas

| Versión        | Soporte de seguridad |
| -------------- | -------------------- |
| última estable | sí                   |
| anteriores     | no                   |

## Reportar una vulnerabilidad

**No abras un issue público** para reportar vulnerabilidades. Hazlo por canal privado a
**seguridad@alexendros.dev**, o mediante los _Security Advisories_ privados de GitHub
(pestaña _Security_ → _Report a vulnerability_).

Incluye en el reporte:

- Descripción del problema y posible impacto.
- Pasos para reproducir o prueba de concepto.
- Versiones/commits afectados.
- Cualquier mitigación temporal conocida.

## SLA de respuesta

- Acuse de recibo: 72 horas hábiles.
- Evaluación inicial: 7 días naturales.
- Resolución o plan de mitigación: 30 días naturales.

## Superficie sensible de este proyecto

- Endpoints públicos `/api/contact` y `/api/track-event`: validación Zod, rate-limit,
  verificación de mismo origen y honeypot.
- Captura de leads (PII): no se registra PII en logs; el correo de bienvenida escapa la
  entrada de usuario.
- Cabeceras de seguridad (CSP, HSTS, etc.) definidas en `apps/landing/next.config.ts`.

Renovate (`.github/renovate.json`) cubre `npm` y `github-actions`. No hay Dependabot de
version-updates (sí Alerts). Política de esta plantilla (más estricta que el canon
hasta que se copie a `repo-standard`):

- Automerge solo para patch/minor/pin/digest de **devDependencies** y para
  `lockFileMaintenance`, con `platformAutomerge` y CI verde obligatoria.
- Dependencias de producción y GitHub Actions: PR de revisión, sin automerge.
- Majors: `dependencyDashboardApproval: true`, sin automerge y en PRs separados
  (no se agrupan toolchain majors).
- `vulnerabilityAlerts` con etiqueta `security`, sin automerge y fuera del
  schedule (`at any time`).
- Límites: `prConcurrentLimit: 5`, `prHourlyLimit: 2`; schedule `before 7am`
  (`Europe/Madrid`).
