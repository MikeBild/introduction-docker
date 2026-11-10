#!/usr/bin/env bash
# A container is a process on the kernel of the host – not a machine of its own.
set -euo pipefail

# 1. The process in the container has PID 1: it is the only process in its namespace.
docker run --rm node:26-slim node -e "console.log('PID', process.pid, 'Node', process.version)"

# 2. Same kernel: containers do not bring a kernel of their own.
#    On macOS and Windows that is the kernel of the Linux VM of Docker Desktop.
docker run --rm node:26-slim uname -r

# 3. The kernel enforces limits through cgroups: 256 MiB of memory, half a CPU.
docker run --rm --memory 256m --cpus 0.5 node:26-slim \
  cat /sys/fs/cgroup/memory.max /sys/fs/cgroup/cpu.max

# 4. By default the process runs as root – the lesson on images changes that.
docker run --rm node:26-slim id
