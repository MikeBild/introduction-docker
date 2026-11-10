#!/usr/bin/env bash
# Connect the API and Postgres by hand: a network of its own, a named volume.
set -euo pipefail
cd "$(dirname "$0")"

# TODO 1: Create the bridge network shop-net (docker network create).

# TODO 2: Create the named volume shop-db (docker volume create).

# TODO 3: Start postgres:18 as container db in the network shop-net.
#         Volume shop-db at /var/lib/postgresql, db/init.sql at /docker-entrypoint-initdb.d/init.sql (read-only).
#         POSTGRES_PASSWORD=werkstatt, POSTGRES_DB=shop. No -p: Postgres stays internal.
#         Then wait with pg_isready until Postgres is ready.

# TODO 4: Build shop-api:1.0.0 and start it as container api in the network shop-net with -p 3000:3000.
#         DATABASE_URL=postgres://postgres:werkstatt@db:5432/shop

# TODO 5: Place an order with POST /orders, remove the container db,
#         start it again with the same volume and check with GET /orders that the order is still there.
