#!/usr/bin/env bash
# Smoke de la landing Next.js (sin Playwright). Usado por el job CI `smoke`.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="${SMOKE_APP:-${ROOT}/apps/landing}"
PORT="${SMOKE_PORT:-3000}"
BASE="http://127.0.0.1:${PORT}"
MARKER="${SMOKE_MARKER:-Nimbus}"

if [[ ! -d "${APP}/.next" ]]; then
  echo "error: no existe ${APP}/.next. Ejecuta pnpm build antes." >&2
  exit 1
fi

if [[ ! -f "${APP}/.next/BUILD_ID" ]]; then
  echo "error: falta ${APP}/.next/BUILD_ID (artefacto incompleto)." >&2
  exit 1
fi

echo "artefacto Next.js OK (BUILD_ID=$(cat "${APP}/.next/BUILD_ID"))"

if ! command -v curl >/dev/null 2>&1; then
  echo "error: curl es necesario para el smoke HTTP" >&2
  exit 1
fi

cd "${ROOT}"
pnpm --filter @landing/web exec next start -p "${PORT}" -H 127.0.0.1 \
  >/tmp/landing-smoke-http.log 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
  wait "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

ready=false
for _ in $(seq 1 60); do
  if curl -fsS -o /dev/null "${BASE}/" 2>/dev/null; then
    ready=true
    break
  fi
  if ! kill -0 "$server_pid" >/dev/null 2>&1; then
    echo "error: next start terminó antes de aceptar conexiones" >&2
    tail -n 80 /tmp/landing-smoke-http.log >&2 || true
    exit 1
  fi
  sleep 0.5
done

if [[ "$ready" != "true" ]]; then
  echo "error: timeout esperando ${BASE}/" >&2
  tail -n 80 /tmp/landing-smoke-http.log >&2 || true
  exit 1
fi

routes=(/ /gracias /resultados)
for path in "${routes[@]}"; do
  code=$(curl -fsS -o /tmp/landing-smoke-body.html -w '%{http_code}' "${BASE}${path}")
  if [[ "$code" != "200" ]]; then
    echo "error: ${path} → HTTP ${code}" >&2
    exit 1
  fi
  if ! grep -qiE "${MARKER}|gracias|resultados|nimbus" /tmp/landing-smoke-body.html; then
    echo "error: ${path} no contiene marca de plantilla (${MARKER})" >&2
    exit 1
  fi
  echo "HTTP 200 ${path}"
done

echo "smoke OK"
