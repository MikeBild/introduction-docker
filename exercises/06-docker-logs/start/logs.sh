#!/usr/bin/env bash
# Logs aller Services lesen, filtern und prüfen, welcher Driver sie speichert.
set -euo pipefail
cd "$(dirname "$0")"

# Eine Bestellung erzeugt eine Logzeile.
curl -fs -X POST http://localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","items":[{"productId":"p-zange","quantity":1}]}' >/dev/null

# TODO 1: Zeig die letzten 20 Zeilen aller Services (docker compose logs --tail).

# TODO 2: Zeig nur die API mit Zeitstempel seit zehn Minuten (-t, --since).

# TODO 3: Filtere ohne Präfix (--no-log-prefix) mit jq nur die Zeilen mit msg "order placed".

# TODO 4: Lies mit docker inspect die LogConfig von werkstatt-shop-api-1 aus.
