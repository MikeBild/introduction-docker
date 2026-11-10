#!/usr/bin/env bash
# Read the logs of all services, filter them and check which driver stores them.
set -euo pipefail
cd "$(dirname "$0")"

# One order produces one log line.
curl -fs -X POST http://localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","items":[{"productId":"p-zange","quantity":1}]}' >/dev/null

# All services, with the service name as prefix, the last 20 lines.
docker compose logs --tail 20

# Only the API, with timestamps from Docker, since ten minutes ago.
docker compose logs -t --since 10m api

# Without the prefix every line is pure JSON – jq filters by fields instead of text.
docker compose logs --no-log-prefix api | jq -c 'select(.msg == "order placed")'

# Which driver is active, with which options?
docker inspect --format '{{json .HostConfig.LogConfig}}' werkstatt-shop-api-1
