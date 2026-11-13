*English · [Deutsch](README.de.md)*

# Exercises: Docker

Exercise repository for the Docker part of the workshop “Docker & Kubernetes”. Every Docker lesson comes with an exercise that has a starting point, tests and a solution. All exercises revolve around the same application, the workshop shop API: products, orders with items made of `productId`, `quantity` and `priceCents`, money always in whole cents.

## What you learn

- Understand a container as a process and build lean images in several stages
- Start stacks reliably with volumes, networks, Compose and healthchecks
- Read logs, distribute images through a registry and check them with Trivy

## Prerequisites

- **Docker** – Docker Desktop or Docker Engine with the Compose plugin. Check the versions:

  ```bash
  docker version
  docker compose version
  ```

- **Node.js 26** – `nvm use` reads the version from [`.nvmrc`](.nvmrc).
- **jq** and **Trivy** for exercises 06 and 08: `brew install jq trivy`.

**Stack (October 2026):** Docker Engine 29 with Compose v5 · Node.js 26 (`node:26-slim`, Distroless `nodejs26-debian13`) · Express 5 · Postgres 18 · `registry:3` · Trivy · TypeScript strict as ESM · Vitest

## Setup

```bash
git clone https://github.com/MikeBild/introduction-docker.git
cd introduction-docker
npm ci
npm run check        # tsc, Vitest and comparison of the app copies – no Docker needed
```

## How to work on an exercise

1. **Starting point:** Change into the starting point with `cd exercises/<nr>/start`. There you find TODO comments and a copy of the app; `docker build .` is enough, every exercise is self-contained.
2. **Tests:** Remove the `.skip` in `start/test/*.test.ts` and run `npx vitest exercises/<nr>/start`. The tests read the Dockerfile, the Compose file and the scripts and check the important decisions. They do not need Docker. Whether a stack really starts is shown by `docker compose up --wait`; the CI does that for exercises 03, 05 and 08.
3. **Solution:** `solution/` holds one possible solution with the same structure.

Every exercise builds on the previous one: the starting point of 05 is the solution of 04, and so on. You can still start at any number.

## Exercises

| Block | # | Lesson | ID | Exercise |
| --- | --- | --- | --- | --- |
| Docker | 01 | A container is a process, not a VM | `container-vs-vm` | [exercises/01-container-vs-vm](exercises/01-container-vs-vm) |
| Docker | 02 | A good image is built in several stages | `docker-image-build` | [exercises/02-docker-image-build](exercises/02-docker-image-build) |
| Docker | 03 | Data and networks live outside the container | `docker-volumes-networks` | [exercises/03-docker-volumes-networks](exercises/03-docker-volumes-networks) |
| Docker | 04 | Compose describes the whole stack | `docker-compose` | [exercises/04-docker-compose](exercises/04-docker-compose) |
| Docker | 05 | Started does not mean ready | `docker-healthchecks` | [exercises/05-docker-healthchecks](exercises/05-docker-healthchecks) |
| Docker | 06 | Logs belong on stdout, not in files | `docker-logs` | [exercises/06-docker-logs](exercises/06-docker-logs) |
| Docker | 07 | An image is only done when it sits in the registry | `docker-registry` | [exercises/07-docker-registry](exercises/07-docker-registry) |
| Security | 08 | A small image has fewer vulnerabilities | `docker-image-security` | [exercises/08-docker-image-security](exercises/08-docker-image-security) |

The exercises for the Kubernetes part of the workshop are in [MikeBild/introduction-kubernetes](https://github.com/MikeBild/introduction-kubernetes).

## Layout

```text
app/                     workshop shop API: Express 5, postgres.js, zod
  src/main.ts            startup, graceful shutdown on SIGTERM
  src/app.ts             routes: /products, /orders, /livez, /readyz, /version
  db/init.sql            tables and three products
exercises/
  02-docker-image-build/
    README.md            task, steps, acceptance criteria
    start/               your starting point with TODO comments and a copy of the app
      test/*.test.ts     tests with describe.skip
    solution/            one possible solution, same structure
archive/2018/            the material from 2018, kept as an archive only
```

The app is copied into every starting point and every solution. If you change `app/`, `npm run sync` redistributes the copies; `npm run check` reports outdated copies.

## Packages

The app uses three packages, each for a reason:

- `express` 5 – HTTP routing; errors from async handlers reach the error handler without an extra package.
- `postgres` (postgres.js) – SQL as a tagged template, parameters never in the SQL text, pool and transactions built in.
- `zod` 4 – the same schema for orders as in the frontend of the workshop shop.

For development: `typescript`, `vitest`, `@types/node`, `@types/express` and `yaml` for the tests of the Compose files.

## Cleanup

```bash
docker compose down -v                       # in the respective exercise folder
bash exercises/03-docker-volumes-networks/solution/cleanup.sh
docker rm -f registry && docker volume rm registry-data
docker image prune                           # dangling images
```

## Workshop and slides

- Workshop (held in German): [“Docker & Kubernetes”](https://workshops.mikebild.dev/w/docker-kubernetes/remote/)
- Slides: [slides.mikebild.dev/introduction-docker-kubernetes.en](https://slides.mikebild.dev/introduction-docker-kubernetes.en.html)
- PDF: [introduction-docker-kubernetes.en.pdf](https://media.mikebild.dev/site/mikebild/decks/introduction-docker-kubernetes/introduction-docker-kubernetes.en.pdf)
- Video: [introduction-docker-kubernetes.en.mp4](https://media.mikebild.dev/site/mikebild/decks/introduction-docker-kubernetes/introduction-docker-kubernetes.en.mp4)
- Posts on mikebild.dev:
  - [Node.js and Redis with Docker Compose](https://www.mikebild.dev/en/blog/nodejs-and-redis-with-docker-compose/)
  - [Central Logging with the ELK Stack in Docker](https://www.mikebild.dev/en/blog/central-logging-with-the-elk-stack-in-docker/)
  - [Running Your Own Docker Registry](https://www.mikebild.dev/en/blog/running-your-own-docker-registry/)

## Archive

The first version from 2018 (Docker Machine, Swarm, Compose file with `version: '3'`, Node.js with Yarn) is kept unchanged as an archive under [`archive/2018/`](archive/2018/) and is neither built nor tested.

## License

[MIT](LICENSE)
