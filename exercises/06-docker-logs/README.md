# 06 · Logs gehören nach stdout, nicht in Dateien

Lektion `docker-logs`. Die API schreibt eine JSON-Zeile pro Ereignis nach stdout. Du liest die Logs mit `docker compose logs`, filterst sie mit `jq` und begrenzt den Platz mit dem Driver `local`.

## Aufgabe

1. Ergänze in [`start/compose.yaml`](start/compose.yaml) einen YAML-Anker `x-logging` mit `driver: local`, `max-size: "10m"` und `max-file: "3"` und hänge ihn mit `logging: *logging` an `api` und `db`.
2. Ergänze [`start/logs.sh`](start/logs.sh): alle Services, nur die API mit Zeitstempel, nur `order placed` per `jq`, die `LogConfig` per `docker inspect`.

```bash
cd exercises/06-docker-logs/start
docker compose up -d --build --wait
bash logs.sh
docker compose logs -f        # live mitlesen, Abbruch mit Strg+C
docker compose down -v
```

## Prüfkriterien

- `docker inspect` zeigt `{"Type":"local","Config":{"max-file":"3","max-size":"10m"}}`.
- `jq` gibt nur die Zeilen mit `"msg":"order placed"` aus.
- Die App selbst kennt weder Logdateien noch Rotation.

Ohne Angabe nutzt Docker den Driver `json-file` ohne Rotation. Für den ganzen Host stellst du den Default in `/etc/docker/daemon.json` mit `"log-driver": "local"` um. Das gilt nur für neu erzeugte Container.

`jq` installierst du mit `brew install jq` oder `apt install jq`.

Entferne in `start/test/logs.test.ts` das `.skip` und führe `npx vitest exercises/06/start` aus.

## Lösung

[`solution/compose.yaml`](solution/compose.yaml) und [`solution/logs.sh`](solution/logs.sh)
