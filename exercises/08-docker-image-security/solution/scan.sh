#!/usr/bin/env bash
# Images auf bekannte Schwachstellen (CVEs) prüfen und Base Images vergleichen.
set -euo pipefail
cd "$(dirname "$0")"

docker compose build api

# 1. Wie groß sind die Kandidaten?
docker image ls --format '{{.Repository}}:{{.Tag}} {{.Size}}' | grep -E '^(node:26-slim|shop-api:1\.1\.0) '

# 2. Alle Funde ab HIGH, auch ohne Fix: erst node:26-slim, dann das Distroless-Image.
trivy image --quiet --severity HIGH,CRITICAL --table-mode summary node:26-slim
trivy image --quiet --severity HIGH,CRITICAL --table-mode summary shop-api:1.1.0

# 3. Gate für die CI: Exit-Code 1, sobald eine kritische Lücke mit Fix auftaucht.
trivy image --quiet --exit-code 1 --severity CRITICAL --ignore-unfixed shop-api:1.1.0

# 4. Keine Shell im Image: Ein Angreifer findet nichts, womit er weiterarbeiten kann.
if docker run --rm --entrypoint sh shop-api:1.1.0 -c true 2>/dev/null; then
  echo "Shell gefunden – das Image ist nicht distroless. Prüf, ob die zweite Stage im Dockerfile auf gcr.io/distroless/nodejs26-debian13:nonroot aufbaut." >&2
  exit 1
fi
echo "keine Shell im Image"
