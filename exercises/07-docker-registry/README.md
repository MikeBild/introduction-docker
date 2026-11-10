*English · [Deutsch](README.de.md)*

# 07 · An image is only done when it sits in the registry

Lesson `docker-registry`. You start a registry of your own with `registry:3`, push the API image into it and start the stack from the registry.

## Task

1. Complete [`start/registry.sh`](start/registry.sh): start the registry, tag, push, query, delete locally, pull.
2. In [`start/compose.yaml`](start/compose.yaml), switch the image of `api` to `localhost:5001/shop-api:1.0.0`.

```bash
cd exercises/07-docker-registry/start
bash registry.sh
docker compose up -d --wait
docker compose down -v
docker rm -f registry && docker volume rm registry-data   # cleanup
```

## Acceptance criteria

- `curl localhost:5001/v2/_catalog` returns `{"repositories":["shop-api"]}`.
- After `docker image rm`, `docker pull` brings the image back with the same digest.
- The registry listens only on `127.0.0.1`, not on all interfaces.

Docker talks to `localhost` without TLS. Every other registry host needs TLS and a login. How to secure the registry with htpasswd and a certificate is shown in the slides [“Docker in der Praxis”](https://slides.mikebild.dev/introduction-docker.html) (in German).

On macOS the AirPlay receiver takes port 5000. That is why the exercise uses port 5001 on the host; inside the container it stays 5000.

Remove the `.skip` in `start/test/registry.test.ts` and run `npx vitest exercises/07-docker-registry/start`.

## Solution

[`solution/registry.sh`](solution/registry.sh) and [`solution/compose.yaml`](solution/compose.yaml)
