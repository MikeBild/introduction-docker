#!/usr/bin/env bash
# Start a registry of your own, push the image into it and pull it back out.
set -euo pipefail
cd "$(dirname "$0")"

# 1. The registry is a container itself: registry:3, data in a named volume.
#    Port 5001 on the host because macOS takes port 5000 for AirPlay.
docker run -d --name registry --restart=always \
  -p 127.0.0.1:5001:5000 \
  -v registry-data:/var/lib/registry \
  registry:3
until curl -fs http://localhost:5001/v2/ >/dev/null; do sleep 1; done

# 2. The name selects the target: host:port/name:tag. docker tag copies nothing.
docker build -t shop-api:1.0.0 .
docker tag shop-api:1.0.0 localhost:5001/shop-api:1.0.0

# 3. Upload and look up what the registry knows.
docker push localhost:5001/shop-api:1.0.0
curl -fs http://localhost:5001/v2/_catalog
curl -fs http://localhost:5001/v2/shop-api/tags/list

# 4. Delete locally and fetch from the registry – just as another host or the CI does.
docker image rm localhost:5001/shop-api:1.0.0
docker pull localhost:5001/shop-api:1.0.0

# 5. Reference immutably: by digest instead of by tag.
docker image inspect --format '{{json .RepoDigests}}' localhost:5001/shop-api:1.0.0
