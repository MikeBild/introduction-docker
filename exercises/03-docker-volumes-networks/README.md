# 03 · Daten und Netze leben außerhalb des Containers

Lektion `docker-volumes-networks`. Du verbindest die Werkstatt-Shop-API von Hand mit Postgres: über ein eigenes Netz und ein Named Volume.

## Aufgabe

Ergänze [`start/run.sh`](start/run.sh):

1. Bridge-Netz `shop-net` und Named Volume `shop-db` anlegen.
2. `postgres:18` als Container `db` im Netz starten, Volume nach `/var/lib/postgresql`, `db/init.sql` nach `/docker-entrypoint-initdb.d/`. Kein `-p`.
3. `shop-api:1.0.0` bauen und als Container `api` mit `-p 3000:3000` und `DATABASE_URL=postgres://postgres:werkstatt@db:5432/shop` starten.
4. Eine Bestellung anlegen, `db` löschen, mit demselben Volume neu starten und die Bestellung wieder abfragen.

```bash
cd exercises/03-docker-volumes-networks/start
bash run.sh
bash cleanup.sh   # räumt Container, Netz und Volume ab
```

## Prüfkriterien

- `curl localhost:3000/products` liefert drei Produkte.
- Nach dem Neustart von `db` liefert `GET /orders` die Bestellung noch.
- `docker port db` zeigt nichts: Postgres ist nur im Netz `shop-net` erreichbar.

Ab Postgres 18 liegt das Volume des offiziellen Images unter `/var/lib/postgresql`, nicht mehr unter `/var/lib/postgresql/data`. Die Daten stehen darin in einem Unterordner je Major-Version.

Entferne in `start/test/run.test.ts` das `.skip` und führe `npx vitest exercises/03-docker-volumes-networks/start` aus.

## Lösung

[`solution/run.sh`](solution/run.sh)
