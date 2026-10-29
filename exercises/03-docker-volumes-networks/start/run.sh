#!/usr/bin/env bash
# API und Postgres von Hand verbinden: ein eigenes Netz, ein Named Volume.
set -euo pipefail
cd "$(dirname "$0")"

# TODO 1: Leg das Bridge-Netz shop-net an (docker network create).

# TODO 2: Leg das Named Volume shop-db an (docker volume create).

# TODO 3: Starte postgres:18 als Container db im Netz shop-net.
#         Volume shop-db nach /var/lib/postgresql, db/init.sql nach /docker-entrypoint-initdb.d/init.sql (read-only).
#         POSTGRES_PASSWORD=werkstatt, POSTGRES_DB=shop. Kein -p: Postgres bleibt intern.
#         Warte danach mit pg_isready, bis Postgres bereit ist.

# TODO 4: Bau shop-api:1.0.0 und starte es als Container api im Netz shop-net mit -p 3000:3000.
#         DATABASE_URL=postgres://postgres:werkstatt@db:5432/shop

# TODO 5: Leg per POST /orders eine Bestellung an, lösche den Container db,
#         starte ihn mit demselben Volume neu und prüf mit GET /orders, dass die Bestellung noch da ist.
