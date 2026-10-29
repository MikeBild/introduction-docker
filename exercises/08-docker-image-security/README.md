# 08 · Ein kleines Image hat weniger Lücken

Lektion `docker-image-security`. Du scannst das Image der API mit Trivy, wechselst auf ein Distroless-Image und härtest den Container.

## Aufgabe

1. Ersetz in [`start/Dockerfile`](start/Dockerfile) die zweite Stage durch `gcr.io/distroless/nodejs26-debian13:nonroot`. `node` ist dort schon der Entrypoint: `CMD ["src/main.ts"]`, `USER node` entfällt.
2. Ergänze [`start/scan.sh`](start/scan.sh): Größen vergleichen, beide Images scannen, ein CI-Gate mit `--exit-code 1`, Shell-Probe.
3. Härte `api` in [`start/compose.yaml`](start/compose.yaml): Image `shop-api:1.1.0`, `read_only: true`, `cap_drop: [ALL]`, `security_opt: ["no-new-privileges:true"]`, Healthcheck mit `/nodejs/bin/node`.

```bash
brew install trivy            # oder: https://trivy.dev/latest/getting-started/installation/
cd exercises/08-docker-image-security/start
bash scan.sh
docker compose up -d --wait
docker compose exec api sh    # scheitert: keine Shell im Image
docker compose down -v
```

## Prüfkriterien

- Der Scan von `node:26-slim` zeigt deutlich mehr Funde als der Scan von `shop-api:1.1.0`. Am 29.10.2026 waren es 181 zu 33 Funden über alle Schweregrade, davon 49 zu 0 mit HIGH.
- Das CI-Gate endet mit Exit-Code 0.
- Der gehärtete Stack wird `healthy`, obwohl das Dateisystem der API read-only ist.

Die Zahlen ändern sich täglich, weil neue Schwachstellen (CVEs, Common Vulnerabilities and Exposures) bekannt werden. Scanne deshalb in der CI bei jedem Build und regelmäßig auch Images, die schon in der Registry liegen. Alternativ zu Trivy zeigt `docker scout cves shop-api:1.1.0` dieselbe Art Bericht.

Entferne in `start/test/security.test.ts` das `.skip` und führe `npx vitest exercises/08-docker-image-security/start` aus.

## Lösung

[`solution/Dockerfile`](solution/Dockerfile), [`solution/compose.yaml`](solution/compose.yaml) und [`solution/scan.sh`](solution/scan.sh)
