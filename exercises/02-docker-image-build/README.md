*English · [Deutsch](README.de.md)*

# 02 · A good image is built in several stages

Lesson `docker-image-build`. You turn a naive Dockerfile into a small, reproducible image for the workshop shop API that does not run as root.

## Task

Build the image from [`start/`](start) and note its size and user:

```bash
cd exercises/02-docker-image-build/start
docker build -t shop-api:naiv .
docker image ls shop-api
docker run --rm --entrypoint id shop-api:naiv
```

Then improve [`start/Dockerfile`](start/Dockerfile) and add a `.dockerignore`:

1. Base image `node:26-slim` instead of `node:latest`.
2. Stage `deps` with `npm ci --omit=dev`; the second stage copies only `node_modules`, `package.json` and `src`.
3. Copy the lockfile before the source code so the layer with the dependencies stays in the cache.
4. `USER node` and `CMD ["node", "src/main.ts"]`.
5. `.dockerignore` with `node_modules`, `test`, `.git` and `.env*`.

```bash
docker build -t shop-api:1.0.0 .
docker image ls shop-api
docker history shop-api:1.0.0
docker run --rm --entrypoint id shop-api:1.0.0
```

## Acceptance criteria

- The image is considerably smaller than `shop-api:naiv`.
- `id` shows `uid=1000(node)`.
- If you change only `src/app.ts`, Docker does not rebuild the dependencies (`CACHED` in the build log).

Node.js 26 runs TypeScript directly. That is why the image needs no build step with `tsc`.

Remove the `.skip` in `start/test/dockerfile.test.ts` and run `npx vitest exercises/02-docker-image-build/start`.

## Solution

[`solution/Dockerfile`](solution/Dockerfile) and [`solution/.dockerignore`](solution/.dockerignore)
