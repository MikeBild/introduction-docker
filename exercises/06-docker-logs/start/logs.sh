#!/usr/bin/env bash
# Read the logs of all services, filter them and check which driver stores them.
set -euo pipefail
cd "$(dirname "$0")"

# One order produces one log line.
curl -fs -X POST http://localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","items":[{"productId":"p-zange","quantity":1}]}' >/dev/null

# TODO 1: Show the last 20 lines of all services (docker compose logs --tail).

# TODO 2: Show only the API with timestamps since ten minutes ago (-t, --since).

# TODO 3: Without the prefix (--no-log-prefix), filter only the lines with msg "order placed" using jq.

# TODO 4: Read the LogConfig of werkstatt-shop-api-1 with docker inspect.
