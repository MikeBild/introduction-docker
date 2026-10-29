# Übungen: Docker

Übungs-Repo zum ersten Teil des Workshops **„Docker & Kubernetes“** ([workshops.mikebild.dev](https://workshops.mikebild.dev)). Zu jeder Docker-Lektion findest du hier eine Aufgabe mit Startpunkt, Lösung und Tests. Alle Übungen drehen sich um dieselbe Anwendung, die Werkstatt-Shop-API: Produkte, Bestellungen mit Positionen aus `productId`, `quantity` und `priceCents`, Geld immer in ganzen Cent.

Den Kubernetes-Teil findest du in [MikeBild/introduction-kubernetes](https://github.com/MikeBild/introduction-kubernetes). Die Folien stehen unter [slides.mikebild.dev](https://slides.mikebild.dev/introduction-docker.html).

**Stack (Oktober 2026):** Docker Engine 29 mit Compose v5 · Node.js 26 (`node:26-slim`, Distroless `nodejs26-debian13`) · Express 5 · Postgres 18 · `registry:3` · Trivy · TypeScript strict als ESM · Vitest

## Vorbereitung

1. **Docker** – Docker Desktop oder Docker Engine mit Compose-Plugin. Prüf die Versionen:

   ```bash
   docker version
   docker compose version
   ```

2. **Node.js 26** für die Tests – `nvm use` liest die Version aus [`.nvmrc`](.nvmrc).
3. **jq** und **Trivy** für die Übungen 06 und 08: `brew install jq trivy`.
4. Repo klonen, Abhängigkeiten installieren, alles prüfen:

   ```bash
   git clone https://github.com/MikeBild/introduction-docker.git
   cd introduction-docker
   npm ci
   npm run check        # tsc, Vitest und Abgleich der App-Kopien – ohne Docker
   ```

## Aufbau

```text
app/                     Werkstatt-Shop-API: Express 5, postgres.js, zod
  src/main.ts            Start, Graceful Shutdown bei SIGTERM
  src/app.ts             Routen: /products, /orders, /livez, /readyz, /version
  db/init.sql            Tabellen und drei Produkte
exercises/
  02-docker-image-build/
    README.md            Aufgabe, Ablauf, Prüfkriterien
    start/               dein Startpunkt mit TODO-Kommentaren und einer Kopie der App
      test/*.test.ts     Tests mit describe.skip – entferne .skip, wenn du loslegst
    solution/            eine mögliche Lösung, gleiche Struktur
legacy/2018/             das Material von 2018, nur als Archiv
```

Jede Übung ist eigenständig: `cd exercises/<nr>/start` und `docker build .` reichen. Die App liegt deshalb als Kopie in jedem Startpunkt und jeder Lösung. Änderst du `app/`, verteilt `npm run sync` die Kopien neu; `npm run check` meldet veraltete Kopien.

Die Tests lesen Dockerfile, Compose-Datei und Skripte und prüfen die wichtigen Entscheidungen. Sie brauchen kein Docker. Ob ein Stack wirklich startet, zeigt dir `docker compose up --wait`; die CI tut das für die Übungen 03, 05 und 08.

## Lektionen

| Block | # | Lektion | Baustein | Übung |
| --- | --- | --- | --- | --- |
| Docker | 01 | Ein Container ist ein Prozess, keine VM | `container-vs-vm` | [exercises/01-container-vs-vm](exercises/01-container-vs-vm) |
| Docker | 02 | Ein gutes Image entsteht in mehreren Stages | `docker-image-build` | [exercises/02-docker-image-build](exercises/02-docker-image-build) |
| Docker | 03 | Daten und Netze leben außerhalb des Containers | `docker-volumes-networks` | [exercises/03-docker-volumes-networks](exercises/03-docker-volumes-networks) |
| Docker | 04 | Compose beschreibt den ganzen Stack | `docker-compose` | [exercises/04-docker-compose](exercises/04-docker-compose) |
| Docker | 05 | Gestartet heißt noch nicht bereit | `docker-healthchecks` | [exercises/05-docker-healthchecks](exercises/05-docker-healthchecks) |
| Docker | 06 | Logs gehören nach stdout, nicht in Dateien | `docker-logs` | [exercises/06-docker-logs](exercises/06-docker-logs) |
| Docker | 07 | Ein Image ist erst fertig, wenn es in der Registry liegt | `docker-registry` | [exercises/07-docker-registry](exercises/07-docker-registry) |
| Sicherheit | 08 | Ein kleines Image hat weniger Lücken | `docker-image-security` | [exercises/08-docker-image-security](exercises/08-docker-image-security) |

Jede Übung baut auf der vorherigen auf: Der Startpunkt von 05 ist die Lösung von 04 und so weiter. Du kannst trotzdem bei jeder Nummer einsteigen.

## Pakete

Die App nutzt drei Pakete, jedes mit einem Grund:

- `express` 5 – HTTP-Routing; Fehler aus async Handlern landen ohne Zusatzpaket im Error Handler.
- `postgres` (postgres.js) – SQL als Tagged Template, Parameter nie im SQL-Text, Pool und Transactions eingebaut.
- `zod` 4 – dasselbe Schema für Bestellungen wie im Frontend des Werkstatt-Shops.

Dazu für die Entwicklung: `typescript`, `vitest`, `@types/node`, `@types/express` und `yaml` für die Tests der Compose-Dateien.

## Aufräumen

```bash
docker compose down -v                       # im jeweiligen Übungsordner
bash exercises/03-docker-volumes-networks/solution/cleanup.sh
docker rm -f registry && docker volume rm registry-data
docker image prune                           # verwaiste Images
```

## Altes Material von 2018

Die erste Fassung von 2018 (Docker Machine, Swarm, Compose-Datei mit `version: '3'`, Node.js mit Yarn) liegt unverändert unter [`legacy/2018/`](legacy/2018/). Sie ist nur noch als Archiv gedacht und wird weder gebaut noch getestet.

## Lizenz

[MIT](LICENSE)
