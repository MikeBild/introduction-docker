# 02 · Ein gutes Image entsteht in mehreren Stages

Lektion `docker-image-build`. Du machst aus einem naiven Dockerfile ein kleines, reproduzierbares Image für die Werkstatt-Shop API, das nicht als root läuft.

## Aufgabe

Bau das Image aus [`start/`](start) und notier Größe und User:

```bash
cd exercises/02-docker-image-build/start
docker build -t shop-api:naiv .
docker image ls shop-api
docker run --rm --entrypoint id shop-api:naiv
```

Verbessere dann [`start/Dockerfile`](start/Dockerfile) und leg eine `.dockerignore` an:

1. Base Image `node:26-slim` statt `node:latest`.
2. Stage `deps` mit `npm ci --omit=dev`; die zweite Stage kopiert nur `node_modules`, `package.json` und `src`.
3. Lockfile vor dem Quellcode kopieren, damit der Layer mit den Dependencies im Cache bleibt.
4. `USER node` und `CMD ["node", "src/main.ts"]`.
5. `.dockerignore` mit `node_modules`, `test`, `.git` und `.env*`.

```bash
docker build -t shop-api:1.0.0 .
docker image ls shop-api
docker history shop-api:1.0.0
docker run --rm --entrypoint id shop-api:1.0.0
```

## Prüfkriterien

- Das Image ist deutlich kleiner als `shop-api:naiv`.
- `id` zeigt `uid=1000(node)`.
- Änderst du nur `src/app.ts`, baut Docker die Dependencies nicht neu (`CACHED` im Build-Log).

Node.js 26 führt TypeScript direkt aus. Deshalb braucht das Image keinen Build-Schritt mit `tsc`.

Entferne in `start/test/dockerfile.test.ts` das `.skip` und führe `npx vitest exercises/02/start` aus.

## Lösung

[`solution/Dockerfile`](solution/Dockerfile) und [`solution/.dockerignore`](solution/.dockerignore)
