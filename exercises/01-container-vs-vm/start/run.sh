#!/usr/bin/env bash
# Ein Container ist ein Prozess auf dem Kernel des Hosts – keine eigene Maschine.
set -euo pipefail

# TODO 1: Starte node:26-slim mit --rm und gib process.pid und process.version aus.

# TODO 2: Gib im Container die Kernel-Version aus (uname -r) und vergleiche sie mit dem Host.

# TODO 3: Begrenze den Container auf 256 MiB Speicher und eine halbe CPU (--memory, --cpus)
#         und lies die Grenzen aus /sys/fs/cgroup/memory.max und /sys/fs/cgroup/cpu.max.

# TODO 4: Prüfe mit id, als welcher User der Prozess läuft.
