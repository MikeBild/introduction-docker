#!/usr/bin/env bash
# Ein Container ist ein Prozess auf dem Kernel des Hosts – keine eigene Maschine.
set -euo pipefail

# 1. Der Prozess im Container hat die PID 1: Er ist der einzige Prozess in seinem Namespace.
docker run --rm node:26-slim node -e "console.log('PID', process.pid, 'Node', process.version)"

# 2. Gleicher Kernel: Container bringen keinen eigenen Kernel mit.
#    Auf macOS und Windows ist das der Kernel der Linux-VM von Docker Desktop.
docker run --rm node:26-slim uname -r

# 3. Grenzen setzt der Kernel über cgroups: 256 MiB Speicher, eine halbe CPU.
docker run --rm --memory 256m --cpus 0.5 node:26-slim \
  cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/cpu.max

# 4. Ab Werk läuft der Prozess als root – das ändert die Lektion zu Images.
docker run --rm node:26-slim id
