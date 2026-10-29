# 07 · Ein Image ist erst fertig, wenn es in der Registry liegt

Lektion `docker-registry`. Du startest eine eigene Registry mit `registry:3`, schiebst das Image der API hinein und startest den Stack aus der Registry.

## Aufgabe

1. Ergänze [`start/registry.sh`](start/registry.sh): Registry starten, taggen, pushen, abfragen, lokal löschen, pullen.
2. Stell in [`start/compose.yaml`](start/compose.yaml) das Image von `api` auf `localhost:5001/shop-api:1.0.0` um.

```bash
cd exercises/07-docker-registry/start
bash registry.sh
docker compose up -d --wait
docker compose down -v
docker rm -f registry && docker volume rm registry-data   # aufräumen
```

## Prüfkriterien

- `curl localhost:5001/v2/_catalog` liefert `{"repositories":["shop-api"]}`.
- Nach `docker image rm` holt `docker pull` das Image mit demselben Digest zurück.
- Die Registry hört nur auf `127.0.0.1`, nicht auf allen Interfaces.

Docker spricht mit `localhost` auch ohne TLS. Jeder andere Registry-Host braucht TLS und ein Login. Wie du die Registry mit htpasswd und Zertifikat absicherst, zeigen die Folien [„Docker in der Praxis“](https://slides.mikebild.dev/introduction-docker.html).

Port 5000 belegt unter macOS der AirPlay-Empfänger. Deshalb nutzt die Übung auf dem Host Port 5001, im Container bleibt es 5000.

Entferne in `start/test/registry.test.ts` das `.skip` und führe `npx vitest exercises/07-docker-registry/start` aus.

## Lösung

[`solution/registry.sh`](solution/registry.sh) und [`solution/compose.yaml`](solution/compose.yaml)
