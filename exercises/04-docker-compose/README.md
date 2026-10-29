# 04 · Compose beschreibt den ganzen Stack

Lektion `docker-compose`. Du ersetzt die Befehle aus Übung 03 durch eine `compose.yaml`: Werkstatt-Shop-API mit Express 5 und Postgres 18.

## Aufgabe

Ergänze [`start/compose.yaml`](start/compose.yaml):

1. `api`: `DATABASE_URL` mit dem Hostnamen `db`, Port `3000:3000`, `depends_on: [db]`.
2. `db`: `postgres:18`, Passwort und Datenbank über `environment`, Named Volume `db-data` nach `/var/lib/postgresql`, `./db/init.sql` read-only nach `/docker-entrypoint-initdb.d/`. Keine `ports`.
3. `db-data` unter `volumes` auf oberster Ebene deklarieren.

```bash
cd exercises/04-docker-compose/start
docker compose up -d --build
docker compose ps
curl localhost:3000/products
docker compose down        # Container und Netz weg, Volume bleibt
docker compose down -v     # auch das Volume weg
```

## Prüfkriterien

- `docker compose config` meldet keinen Fehler.
- `curl localhost:3000/products` liefert drei Produkte.
- `docker compose ps` zeigt für `db` keinen veröffentlichten Port.
- Nach `down` und `up` sind Bestellungen noch da, nach `down -v` nicht mehr.

Beobachte direkt nach `up` einmal `curl localhost:3000/readyz`: Die API läuft schon, Postgres vielleicht noch nicht. Das löst die nächste Übung.

Entferne in `start/test/compose.test.ts` das `.skip` und führe `npx vitest exercises/04/start` aus.

## Lösung

[`solution/compose.yaml`](solution/compose.yaml)
