#!/usr/bin/env bash
# Connect the API and Postgres by hand: a network of its own, a named volume.
set -euo pipefail
cd "$(dirname "$0")"

# 1. A bridge network of its own: containers find each other by name (DNS).
docker network create shop-net

# 2. Named volume for the Postgres data. It outlives every container.
docker volume create shop-db

# 3. Postgres 18 in the network, data in the volume. Since version 18 the volume is at /var/lib/postgresql.
#    init.sql creates tables and products on the first start. No -p: Postgres stays internal.
docker run -d --name db --network shop-net \
  -v shop-db:/var/lib/postgresql \
  -v "$PWD/db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro" \
  -e POSTGRES_PASSWORD=werkstatt -e POSTGRES_DB=shop \
  postgres:18
until docker exec db pg_isready -U postgres -d shop >/dev/null 2>&1; do sleep 1; done

# 4. The API in the same network. The hostname db is the container name.
docker build -t shop-api:1.0.0 .
docker run -d --name api --network shop-net -p 3000:3000 \
  -e DATABASE_URL=postgres://postgres:werkstatt@db:5432/shop \
  shop-api:1.0.0
until curl -fs http://localhost:3000/readyz >/dev/null; do sleep 1; done

# 5. Place an order, then throw Postgres away and start it again with the same volume.
curl -fs -X POST http://localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","items":[{"productId":"p-hammer","quantity":2}]}'
echo
docker rm -f db
docker run -d --name db --network shop-net -v shop-db:/var/lib/postgresql \
  -e POSTGRES_PASSWORD=werkstatt -e POSTGRES_DB=shop postgres:18
until curl -fs http://localhost:3000/readyz >/dev/null; do sleep 1; done

# The order is still there: the data lives in the volume, not in the container.
curl -fs http://localhost:3000/orders
echo
