#!/usr/bin/env bash
# Check images for known vulnerabilities (CVEs) and compare base images.
set -euo pipefail
cd "$(dirname "$0")"

docker compose build api

# 1. How large are the candidates?
docker image ls --format '{{.Repository}}:{{.Tag}} {{.Size}}' | grep -E '^(node:26-slim|shop-api:1\.1\.0) '

# 2. All findings from HIGH up, even without a fix: first node:26-slim, then the Distroless image.
trivy image --quiet --severity HIGH,CRITICAL --table-mode summary node:26-slim
trivy image --quiet --severity HIGH,CRITICAL --table-mode summary shop-api:1.1.0

# 3. Gate for the CI: exit code 1 as soon as a critical vulnerability with a fix shows up.
trivy image --quiet --exit-code 1 --severity CRITICAL --ignore-unfixed shop-api:1.1.0

# 4. No shell in the image: an attacker finds nothing to continue with.
if docker run --rm --entrypoint sh shop-api:1.1.0 -c true 2>/dev/null; then
  echo "Shell gefunden – das Image ist nicht distroless. Prüf, ob die zweite Stage im Dockerfile auf gcr.io/distroless/nodejs26-debian13:nonroot aufbaut." >&2
  exit 1
fi
echo "keine Shell im Image"
