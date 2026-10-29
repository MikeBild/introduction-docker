#!/usr/bin/env bash
# Eine eigene Registry starten, das Image hineinschieben und wieder herausholen.
set -euo pipefail
cd "$(dirname "$0")"

# TODO 1: Starte registry:3 als Container registry mit --restart=always,
#         -p 127.0.0.1:5001:5000 (macOS belegt Port 5000 für AirPlay) und dem Volume registry-data nach /var/lib/registry.

# TODO 2: Bau shop-api:1.0.0 und gib ihm mit docker tag den Namen localhost:5001/shop-api:1.0.0.

# TODO 3: Push das Image und frag /v2/_catalog und /v2/shop-api/tags/list per curl ab.

# TODO 4: Lösch das Image lokal und hol es mit docker pull aus der Registry zurück.

# TODO 5: Gib die RepoDigests des Images aus.
