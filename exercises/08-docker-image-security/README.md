*English · [Deutsch](README.de.md)*

# 08 · A small image has fewer vulnerabilities

Lesson `docker-image-security`. You scan the API image with Trivy, switch to a Distroless image and harden the container.

## Task

1. In [`start/Dockerfile`](start/Dockerfile), replace the second stage with `gcr.io/distroless/nodejs26-debian13:nonroot`. There `node` is already the entrypoint: `CMD ["src/main.ts"]`, `USER node` is dropped.
2. Complete [`start/scan.sh`](start/scan.sh): compare sizes, scan both images, a CI gate with `--exit-code 1`, a shell probe.
3. Harden `api` in [`start/compose.yaml`](start/compose.yaml): image `shop-api:1.1.0`, `read_only: true`, `cap_drop: [ALL]`, `security_opt: ["no-new-privileges:true"]`, healthcheck with `/nodejs/bin/node`.

```bash
brew install trivy            # or: https://trivy.dev/latest/getting-started/installation/
cd exercises/08-docker-image-security/start
bash scan.sh
docker compose up -d --wait
docker compose exec api sh    # fails: no shell in the image
docker compose down -v
```

## Acceptance criteria

- The scan of `node:26-slim` shows considerably more findings than the scan of `shop-api:1.1.0`. On October 29, 2026 it was 181 to 33 findings across all severities, 49 to 0 of them HIGH.
- The CI gate ends with exit code 0.
- The hardened stack turns `healthy` although the file system of the API is read-only.

The numbers change daily because new vulnerabilities (CVEs, Common Vulnerabilities and Exposures) become known. So scan in the CI on every build, and regularly scan images that already sit in the registry. As an alternative to Trivy, `docker scout cves shop-api:1.1.0` shows the same kind of report.

Remove the `.skip` in `start/test/security.test.ts` and run `npx vitest exercises/08-docker-image-security/start`.

## Solution

[`solution/Dockerfile`](solution/Dockerfile), [`solution/compose.yaml`](solution/compose.yaml) and [`solution/scan.sh`](solution/scan.sh)
