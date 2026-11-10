*English · [Deutsch](README.de.md)*

# 04 · Compose describes the whole stack

Lesson `docker-compose`. You replace the commands from exercise 03 with a `compose.yaml`: the workshop shop API with Express 5 and Postgres 18.

## Task

Complete [`start/compose.yaml`](start/compose.yaml):

1. `api`: `DATABASE_URL` with the hostname `db`, port `3000:3000`, `depends_on: [db]`.
2. `db`: `postgres:18`, password and database via `environment`, named volume `db-data` at `/var/lib/postgresql`, `./db/init.sql` read-only at `/docker-entrypoint-initdb.d/`. No `ports`.
3. Declare `db-data` under `volumes` at the top level.

```bash
cd exercises/04-docker-compose/start
docker compose up -d --build
docker compose ps
curl localhost:3000/products
docker compose down        # containers and network gone, the volume stays
docker compose down -v     # the volume gone too
```

## Acceptance criteria

- `docker compose config` reports no error.
- `curl localhost:3000/products` returns three products.
- `docker compose ps` shows no published port for `db`.
- After `down` and `up` the orders are still there, after `down -v` they are gone.

Right after `up`, run `curl localhost:3000/readyz` once: the API is already running, Postgres maybe not yet. The next exercise solves that.

Remove the `.skip` in `start/test/compose.test.ts` and run `npx vitest exercises/04-docker-compose/start`.

## Solution

[`solution/compose.yaml`](solution/compose.yaml)
