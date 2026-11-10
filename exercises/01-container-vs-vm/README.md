*English · [Deutsch](README.de.md)*

# 01 · A container is a process, not a VM

Lesson `container-vs-vm`. With four commands you show that a container is an isolated process on the kernel of the host.

## Task

Add the four commands to [`start/run.sh`](start/run.sh):

1. Start `node:26-slim` with `--rm` and print `process.pid` and `process.version`.
2. Print the kernel version inside the container with `uname -r` and compare it with the host.
3. Limit the container to 256 MiB and half a CPU (`--memory 256m --cpus 0.5`) and read the limits from `/sys/fs/cgroup`.
4. Check with `id` which user the process runs as.

```bash
cd exercises/01-container-vs-vm/start
bash run.sh
```

## Acceptance criteria

- The process in the container has PID 1.
- The kernel version in the container is the same as on the host or in the VM of Docker Desktop.
- `memory.max` shows `268435456`, `cpu.max` shows `50000 100000`.
- By default the process runs as `root` – you change that in the lesson on images.

Remove the `.skip` in `start/test/run.test.ts` and run `npx vitest exercises/01-container-vs-vm/start`.

## Solution

[`solution/run.sh`](solution/run.sh)
