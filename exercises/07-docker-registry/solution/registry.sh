#!/usr/bin/env bash
# Eine eigene Registry starten, das Image hineinschieben und wieder herausholen.
set -euo pipefail
cd "$(dirname "$0")"

# 1. Die Registry ist selbst ein Container: registry:3, Daten im Named Volume.
#    Port 5001 auf dem Host, weil macOS Port 5000 für AirPlay belegt.
docker run -d --name registry --restart=always \
  -p 127.0.0.1:5001:5000 \
  -v registry-data:/var/lib/registry \
  registry:3
until curl -fs http://localhost:5001/v2/ >/dev/null; do sleep 1; done

# 2. Der Name steuert das Ziel: host:port/name:tag. docker tag kopiert nichts.
docker build -t shop-api:1.0.0 .
docker tag shop-api:1.0.0 localhost:5001/shop-api:1.0.0

# 3. Hochladen und nachsehen, was die Registry kennt.
docker push localhost:5001/shop-api:1.0.0
curl -fs http://localhost:5001/v2/_catalog
curl -fs http://localhost:5001/v2/shop-api/tags/list

# 4. Lokal löschen und aus der Registry holen – so wie es ein anderer Host oder die CI tut.
docker image rm localhost:5001/shop-api:1.0.0
docker pull localhost:5001/shop-api:1.0.0

# 5. Unveränderlich referenzieren: per Digest statt per Tag.
docker image inspect --format '{{json .RepoDigests}}' localhost:5001/shop-api:1.0.0
