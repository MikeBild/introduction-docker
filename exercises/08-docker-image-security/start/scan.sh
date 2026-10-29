#!/usr/bin/env bash
# Images auf bekannte Schwachstellen (CVEs) prüfen und Base Images vergleichen.
set -euo pipefail
cd "$(dirname "$0")"

docker compose build api

# TODO 3a: Vergleich die Größe von node:26-slim und shop-api:1.1.0 (docker image ls).

# TODO 3b: Scanne beide Images mit trivy image --severity HIGH,CRITICAL --table-mode summary.

# TODO 3c: Gate für die CI: trivy mit --exit-code 1 --severity CRITICAL --ignore-unfixed auf shop-api:1.1.0.

# TODO 3d: Prüf, dass im Image keine Shell steckt (docker run --entrypoint sh muss scheitern).
