# 01 · Ein Container ist ein Prozess, keine VM

Lektion `container-vs-vm`. Du zeigst mit vier Befehlen, dass ein Container ein isolierter Prozess auf dem Kernel des Hosts ist.

## Aufgabe

Ergänze in [`start/run.sh`](start/run.sh) die vier Befehle:

1. Starte `node:26-slim` mit `--rm` und gib `process.pid` und `process.version` aus.
2. Gib im Container die Kernel-Version mit `uname -r` aus und vergleiche sie mit dem Host.
3. Begrenze den Container auf 256 MiB und eine halbe CPU (`--memory 256m --cpus 0.5`) und lies die Grenzen aus `/sys/fs/cgroup`.
4. Prüf mit `id`, als welcher User der Prozess läuft.

```bash
cd exercises/01-container-vs-vm/start
bash run.sh
```

## Prüfkriterien

- Der Prozess im Container hat die PID 1.
- Die Kernel-Version ist im Container dieselbe wie auf dem Host bzw. in der VM von Docker Desktop.
- `memory.max` zeigt `268435456`, `cpu.max` zeigt `50000 100000`.
- Ab Werk läuft der Prozess als `root` – das änderst du in der Lektion zu Images.

Entferne in `start/test/run.test.ts` das `.skip` und führe `npx vitest exercises/01-container-vs-vm/start` aus.

## Lösung

[`solution/run.sh`](solution/run.sh)
