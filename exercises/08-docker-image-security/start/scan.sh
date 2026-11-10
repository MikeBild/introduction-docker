#!/usr/bin/env bash
# Check images for known vulnerabilities (CVEs) and compare base images.
set -euo pipefail
cd "$(dirname "$0")"

docker compose build api

# TODO 3a: Compare the size of node:26-slim and shop-api:1.1.0 (docker image ls).

# TODO 3b: Scan both images with trivy image --severity HIGH,CRITICAL --table-mode summary.

# TODO 3c: Gate for the CI: trivy with --exit-code 1 --severity CRITICAL --ignore-unfixed on shop-api:1.1.0.

# TODO 3d: Check that there is no shell in the image (docker run --entrypoint sh must fail).
