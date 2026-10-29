#!/usr/bin/env bash
# Logs aller Services lesen, filtern und prüfen, welcher Driver sie speichert.
set -euo pipefail
cd "$(dirname "$0")"

# Eine Bestellung erzeugt eine Logzeile.
curl -fs -X POST http://localhost:3000/orders -H 'content-type: application/json' \
  -d '{"customerId":"c-1","items":[{"productId":"p-zange","quantity":1}]}' >/dev/null

# Alle Services, mit Servicenamen als Präfix, die letzten 20 Zeilen.
docker compose logs --tail 20

# Nur die API, mit Zeitstempel von Docker, seit zehn Minuten.
docker compose logs -t --since 10m api

# Ohne Präfix ist jede Zeile reines JSON – jq filtert nach Feldern statt nach Text.
docker compose logs --no-log-prefix api | jq -c 'select(.msg == "order placed")'

# Welcher Driver ist aktiv, mit welchen Optionen?
docker inspect --format '{{json .HostConfig.LogConfig}}' werkstatt-shop-api-1
