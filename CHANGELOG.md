# Changelog

Todos los cambios notables de este proyecto se documentan aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado [SemVer](https://semver.org/lang/es/).

## [Sin publicar]

### Changed

- Alineación al canon P1+P2 de plantilla: jobs CI `quality` / `test` / `build` /
  `smoke`, e2e opt-in, Renovate en lugar de Dependabot version-updates, docs P1
  (`AGENTS`, `ARCHITECTURE`, guides/runbooks/ADRs) y meta-sección Propósito.

### Added

- Capa de gobernanza: LICENSE, CONTRIBUTING, SECURITY, CODEOWNERS, plantillas de
  PR e issues, Dependabot y pre-commit (gitleaks).

### Security

- Endurecimiento de `/api/contact` y `/api/track-event` (rate-limit, mismo origen,
  honeypot), escape de HTML en el email, cabeceras de seguridad y cookie `secure`.

### Fixed

- El email comprueba `res.ok`, aplica timeout y exige remitente en producción.

## [0.1.0] - 2026-06-22

### Added

- Landing reutilizable con A/B testing, captura de leads, animaciones y tema
  claro/oscuro. Construcción inicial en 10 fases (PRs #1–#10).
