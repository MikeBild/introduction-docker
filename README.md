# Übungen: Docker

Übungs-Repo zum Docker-Teil des Workshops „Docker & Kubernetes“. Zu jeder Docker-Lektion gibt es eine Übung mit Startpunkt, Tests und Lösung. Alle Übungen drehen sich um dieselbe Anwendung, die Werkstatt-Shop-API: Produkte, Bestellungen mit Positionen aus `productId`, `quantity` und `priceCents`, Geld immer in ganzen Cent.

## Was du lernst

- Container als Prozess verstehen und schlanke Images in mehreren Stages bauen
- Stacks mit Volumes, Netzen, Compose und Healthchecks zuverlässig starten
- Logs lesen, Images über eine Registry verteilen und mit Trivy prüfen

## Voraussetzungen

- **Docker** – Docker Desktop oder Docker Engine mit Compose-Plugin. Prüf die Versionen:

  ```bash
  docker version
  docker compose version
  ```

- **Node.js 26** – `nvm use` liest die Version aus [`.nvmrc`](.nvmrc).
- **jq** und **Trivy** für die Übungen 06 und 08: `brew install jq trivy`.

**Stack (Oktober 2026):** Docker Engine 29 mit Compose v5 · Node.js 26 (`node:26-slim`, Distroless `nodejs26-debian13`) · Express 5 · Postgres 18 · `registry:3` · Trivy · TypeScript strict als ESM · Vitest

## Einrichten

```bash
git clone https://github.com/MikeBild/introduction-docker.git
cd introduction-docker
npm ci
npm run check        # tsc, Vitest und Abgleich der App-Kopien – ohne Docker
```

## So arbeitest du mit einer Übung

1. **Startpunkt:** Wechsle mit `cd exercises/<nr>/start` in den Startpunkt. Dort findest du TODO-Kommentare und eine Kopie der App; `docker build .` reicht, jede Übung ist eigenständig.
2. **Tests:** Entferne in `start/test/*.test.ts` das `.skip` und führe `npx vitest exercises/<nr>/start` aus. Die Tests lesen Dockerfile, Compose-Datei und Skripte und prüfen die wichtigen Entscheidungen. Sie brauchen kein Docker. Ob ein Stack wirklich startet, zeigt dir `docker compose up --wait`; die CI tut das für die Übungen 03, 05 und 08.
3. **Lösung:** In `solution/` liegt eine mögliche Lösung mit derselben Struktur.

Jede Übung baut auf der vorherigen auf: Der Startpunkt von 05 ist die Lösung von 04 und so weiter. Du kannst trotzdem bei jeder Nummer einsteigen.

## Übungen

| Block | # | Lektion | ID | Übung |
| --- | --- | --- | --- | --- |
| Docker | 01 | Ein Container ist ein Prozess, keine VM | `container-vs-vm` | [exercises/01-container-vs-vm](exercises/01-container-vs-vm) |
| Docker | 02 | Ein gutes Image entsteht in mehreren Stages | `docker-image-build` | [exercises/02-docker-image-build](exercises/02-docker-image-build) |
| Docker | 03 | Daten und Netze leben außerhalb des Containers | `docker-volumes-networks` | [exercises/03-docker-volumes-networks](exercises/03-docker-volumes-networks) |
| Docker | 04 | Compose beschreibt den ganzen Stack | `docker-compose` | [exercises/04-docker-compose](exercises/04-docker-compose) |
| Docker | 05 | Gestartet heißt noch nicht bereit | `docker-healthchecks` | [exercises/05-docker-healthchecks](exercises/05-docker-healthchecks) |
| Docker | 06 | Logs gehören nach stdout, nicht in Dateien | `docker-logs` | [exercises/06-docker-logs](exercises/06-docker-logs) |
| Docker | 07 | Ein Image ist erst fertig, wenn es in der Registry liegt | `docker-registry` | [exercises/07-docker-registry](exercises/07-docker-registry) |
| Sicherheit | 08 | Ein kleines Image hat weniger Lücken | `docker-image-security` | [exercises/08-docker-image-security](exercises/08-docker-image-security) |

Die Übungen zum Kubernetes-Teil des Workshops findest du in [MikeBild/introduction-kubernetes](https://github.com/MikeBild/introduction-kubernetes).

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
      test/*.test.ts     Tests mit describe.skip
    solution/            eine mögliche Lösung, gleiche Struktur
legacy/2018/             das Material von 2018, nur als Archiv
```

Die App liegt als Kopie in jedem Startpunkt und jeder Lösung. Änderst du `app/`, verteilt `npm run sync` die Kopien neu; `npm run check` meldet veraltete Kopien.

## Pakete

Die App nutzt drei Pakete, jedes mit einem Grund:

- `express` 5 – HTTP-Routing; Fehler aus asynchronen Handlern landen ohne Zusatzpaket im Error-Handler.
- `postgres` (postgres.js) – SQL als Tagged Template, Parameter nie im SQL-Text, Pool und Transaktionen eingebaut.
- `zod` 4 – dasselbe Schema für Bestellungen wie im Frontend des Werkstatt-Shops.

Dazu für die Entwicklung: `typescript`, `vitest`, `@types/node`, `@types/express` und `yaml` für die Tests der Compose-Dateien.

## Aufräumen

```bash
docker compose down -v                       # im jeweiligen Übungsordner
bash exercises/03-docker-volumes-networks/solution/cleanup.sh
docker rm -f registry && docker volume rm registry-data
docker image prune                           # verwaiste Images
```

## Workshop und Folien

- Workshop: [„Docker & Kubernetes“](https://workshops.mikebild.dev/w/docker-kubernetes/remote/)
- Folien: [slides.mikebild.dev/introduction-docker](https://slides.mikebild.dev/introduction-docker.html)

## Archiv

Die erste Fassung von 2018 (Docker Machine, Swarm, Compose-Datei mit `version: '3'`, Node.js mit Yarn) liegt unverändert als Archiv unter [`legacy/2018/`](legacy/2018/) und wird weder gebaut noch getestet.

## Lizenz

[MIT](LICENSE)
