# 05 · Gestartet heißt noch nicht bereit

Lektion `docker-healthchecks`. Du gibst API und Postgres einen Healthcheck und lässt Compose warten, bis beide wirklich bereit sind.

## Aufgabe

Ergänze [`start/compose.yaml`](start/compose.yaml):

1. `db`: `healthcheck` mit `pg_isready -U postgres -d shop`.
2. `api`: `depends_on` in der Langform mit `condition: service_healthy`.
3. `api`: `healthcheck` auf `/readyz`. `node:26-slim` hat kein `curl`, deshalb prüft `node -e` mit `fetch`.

```bash
cd exercises/05-docker-healthchecks/start
docker compose up -d --build --wait
docker compose ps
docker inspect --format '{{json .State.Health}}' werkstatt-shop-api-1
docker compose down -v
```

## Prüfkriterien

- `up --wait` kehrt erst zurück, wenn beide Services `healthy` sind.
- `docker compose ps` zeigt `(healthy)` bei `api` und `db`.
- Stoppst du `db` mit `docker compose stop db`, wird `api` nach drei Fehlversuchen `unhealthy`.

Der Healthcheck schützt nur den Start. Fällt Postgres später aus, muss die API das selbst vertragen: Hier meldet `/readyz` dann 503, und postgres.js verbindet sich beim nächsten Query neu.

Entferne in `start/test/compose.test.ts` das `.skip` und führe `npx vitest exercises/05-docker-healthchecks/start` aus.

## Lösung

[`solution/compose.yaml`](solution/compose.yaml)
