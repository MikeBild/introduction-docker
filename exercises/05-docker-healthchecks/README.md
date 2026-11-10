*English · [Deutsch](README.de.md)*

# 05 · Started does not mean ready

Lesson `docker-healthchecks`. You give the API and Postgres a healthcheck and let Compose wait until both are really ready.

## Task

Complete [`start/compose.yaml`](start/compose.yaml):

1. `db`: `healthcheck` with `pg_isready -U postgres -d shop`.
2. `api`: `depends_on` in the long form with `condition: service_healthy`.
3. `api`: `healthcheck` on `/readyz`. `node:26-slim` has no `curl`, so `node -e` checks with `fetch`.

```bash
cd exercises/05-docker-healthchecks/start
docker compose up -d --build --wait
docker compose ps
docker inspect --format '{{json .State.Health}}' werkstatt-shop-api-1
docker compose down -v
```

## Acceptance criteria

- `up --wait` returns only when both services are `healthy`.
- `docker compose ps` shows `(healthy)` for `api` and `db`.
- If you stop `db` with `docker compose stop db`, `api` turns `unhealthy` after three failed attempts.

The healthcheck protects only the startup. If Postgres fails later, the API has to cope with that itself: here `/readyz` then returns 503, and postgres.js reconnects on the next query.

Remove the `.skip` in `start/test/compose.test.ts` and run `npx vitest exercises/05-docker-healthchecks/start`.

## Solution

[`solution/compose.yaml`](solution/compose.yaml)
