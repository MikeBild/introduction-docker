*English · [Deutsch](README.de.md)*

# 03 · Data and networks live outside the container

Lesson `docker-volumes-networks`. You connect the workshop shop API to Postgres by hand: through a network of its own and a named volume.

## Task

Complete [`start/run.sh`](start/run.sh):

1. Create the bridge network `shop-net` and the named volume `shop-db`.
2. Start `postgres:18` as container `db` in the network, volume at `/var/lib/postgresql`, `db/init.sql` at `/docker-entrypoint-initdb.d/`. No `-p`.
3. Build `shop-api:1.0.0` and start it as container `api` with `-p 3000:3000` and `DATABASE_URL=postgres://postgres:werkstatt@db:5432/shop`.
4. Place an order, remove `db`, start it again with the same volume and query the order again.

```bash
cd exercises/03-docker-volumes-networks/start
bash run.sh
bash cleanup.sh   # removes container, network and volume
```

## Acceptance criteria

- `curl localhost:3000/products` returns three products.
- After the restart of `db`, `GET /orders` still returns the order.
- `docker port db` shows nothing: Postgres is reachable only inside the network `shop-net`.

Since Postgres 18 the volume of the official image is at `/var/lib/postgresql`, no longer at `/var/lib/postgresql/data`. Inside it, the data sits in a subfolder per major version.

Remove the `.skip` in `start/test/run.test.ts` and run `npx vitest exercises/03-docker-volumes-networks/start`.

## Solution

[`solution/run.sh`](solution/run.sh)
