*English · [Deutsch](README.de.md)*

# 06 · Logs belong on stdout, not in files

Lesson `docker-logs`. The API writes one JSON line per event to stdout. You read the logs with `docker compose logs`, filter them with `jq` and limit the disk space with the driver `local`.

## Task

1. In [`start/compose.yaml`](start/compose.yaml), add a YAML anchor `x-logging` with `driver: local`, `max-size: "10m"` and `max-file: "3"` and attach it to `api` and `db` with `logging: *logging`.
2. Complete [`start/logs.sh`](start/logs.sh): all services, only the API with timestamps, only `order placed` via `jq`, the `LogConfig` via `docker inspect`.

```bash
cd exercises/06-docker-logs/start
docker compose up -d --build --wait
bash logs.sh
docker compose logs -f        # follow live, stop with Ctrl+C
docker compose down -v
```

## Acceptance criteria

- `docker inspect` shows `{"Type":"local","Config":{"max-file":"3","max-size":"10m"}}`.
- `jq` prints only the lines with `"msg":"order placed"`.
- The app itself knows neither log files nor rotation.

Without configuration Docker uses the driver `json-file` without rotation. For the whole host you change the default in `/etc/docker/daemon.json` with `"log-driver": "local"`. That applies only to newly created containers.

Install `jq` with `brew install jq` or `apt install jq`.

Remove the `.skip` in `start/test/logs.test.ts` and run `npx vitest exercises/06-docker-logs/start`.

## Solution

[`solution/compose.yaml`](solution/compose.yaml) and [`solution/logs.sh`](solution/logs.sh)
