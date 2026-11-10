#!/usr/bin/env bash
# A container is a process on the kernel of the host – not a machine of its own.
set -euo pipefail

# TODO 1: Start node:26-slim with --rm and print process.pid and process.version.

# TODO 2: Print the kernel version inside the container (uname -r) and compare it with the host.

# TODO 3: Limit the container to 256 MiB of memory and half a CPU (--memory, --cpus)
#         and read the limits from /sys/fs/cgroup/memory.max and /sys/fs/cgroup/cpu.max.

# TODO 4: Check with id which user the process runs as.
