#!/usr/bin/env bash
# Start a registry of your own, push the image into it and pull it back out.
set -euo pipefail
cd "$(dirname "$0")"

# TODO 1: Start registry:3 as container registry with --restart=always,
#         -p 127.0.0.1:5001:5000 (macOS takes port 5000 for AirPlay) and the volume registry-data at /var/lib/registry.

# TODO 2: Build shop-api:1.0.0 and give it the name localhost:5001/shop-api:1.0.0 with docker tag.

# TODO 3: Push the image and query /v2/_catalog and /v2/shop-api/tags/list with curl.

# TODO 4: Delete the image locally and bring it back from the registry with docker pull.

# TODO 5: Print the RepoDigests of the image.
