#!/usr/bin/env python3
"""Falla solo si OSV reporta severidad HIGH o CRITICAL en el JSON de salida."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else "osv-report.json")
    data = json.loads(path.read_text(encoding="utf-8"))
    bad: list[dict] = []

    for result in data.get("results") or []:
        for pkg in result.get("packages") or []:
            for group in pkg.get("groups") or []:
                sev = (group.get("max_severity") or "").upper()
                if sev in ("HIGH", "CRITICAL"):
                    bad.append(
                        {
                            "severity": sev,
                            "ids": group.get("ids") or [],
                            "pkg": pkg.get("package"),
                        }
                    )
            for vuln in pkg.get("vulnerabilities") or []:
                db = vuln.get("database_specific") or {}
                sev = (db.get("severity") or "").upper()
                if sev in ("HIGH", "CRITICAL"):
                    bad.append(
                        {
                            "severity": sev,
                            "id": vuln.get("id"),
                            "pkg": pkg.get("package"),
                        }
                    )

    if bad:
        print("OSV high/critical:", json.dumps(bad, indent=2))
        return 1

    print("OSV: sin hallazgos high/critical")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
