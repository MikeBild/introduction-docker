#!/usr/bin/env bash
# API und Postgres von Hand verbinden: ein eigenes Netz, ein Named Volume.
set -euo pipefail
cd "$(dirname "$0")"

# 1. Eigenes Bridge-Netz: Container finden sich darin über ihren Namen (DNS).
docker network create shop-net

# 2. Named Volume für die Daten von Postgres. Es überlebt jeden Container.
docker volume create shop-db

# 3. Postgres 18 im Netz, Daten im Volume. Ab Version 18 liegt das Volume unter /var/lib/postgresql.
#    init.sql legt beim ersten Start Tabellen und Produkte an. Kein -p: Postgres bleibt intern.
docker run -d --name db --network shop-net \
  -v shop-db:/var/lib/postgresql \
  -v "$PWD/db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro" \
  -e POSTGRES_PASSWORD=werkstatt -e POSTGRES_DB=shop \
  postgres:18
until docker exec db pg_isready -U postgres -d shop >/dev/null 2>&1; do sleep 1; done

# 4. Die API im selben Netz. Der Hostname db ist der Containername.
docker build -t shop-api:1.0.0 .
docker run -d --name api --network shop-net -p 3000:3000 \
  -e DATABASE_URL=postgres://postgres:werkstatt@db:5432/shop \
  shop-api:1.0.0
until curl -fs http://localhost:3000/readyz >/dev/null; do sleep 1; done

# 5. Bestellen, dann Postgres wegwerfen und mit demselben Volume neu starten.
curl -fs -X POST http://localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","items":[{"productId":"p-hammer","quantity":2}]}'
echo
docker rm -f db
docker run -d --name db --network shop-net -v shop-db:/var/lib/postgresql \
  -e POSTGRES_PASSWORD=werkstatt -e POSTGRES_DB=shop postgres:18
until curl -fs http://localhost:3000/readyz >/dev/null; do sleep 1; done

# Die Bestellung ist noch da: Die Daten liegen im Volume, nicht im Container.
curl -fs http://localhost:3000/orders
echo
