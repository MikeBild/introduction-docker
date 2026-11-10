# CLI Basics

- `docker --version`

- [Run](#run) - Start a container
- [Ps](#ps) - List container
- [Stop](#stop) - Stop a container
- [Start](#start) - Start a container
- [Rm](#rm) - Remove a container
- [Top](#top) - Docker Stats
- [Logs](#logs) - Container logs
- [Inspect](#inspect) - Inspect a container
- [Search](#search) - Search images in registry
- [Kill](#kill) - Kill a container
- [Stats](#stats) - Container Statistics
- [Exec](#exec) - Executes a command in a container
- [Data Management Commands](#data-management-commands)
- [More](#more)

## Run

- `run` - Run
  - `--help` - Help
  - `--restart` - Restart policy `always` | `on-failure` | `no` (default)
  - `--name` - Container name
  - `-e` - Environment Variables
  - `-d` - Detached
  - `-i` - Interactive
  - `-t` - Pseudo-TTY
  - `-p` - Publish Port Mapping `local:remote`
  - `-v` - Volume Mount `/src:/dist`

```bash
docker run hello-world
```

### Run a "Hello World" container

```bash
docker run alpine echo "Hello World"
```

## Run an interactive Container

```bash
docker run -it alpine sh
  cat /etc/os-release
  exit
```

- **-i**: Keep stdin open even if not attached
- **-t**: Allocate a pseudo-tty

### Run a container and expose a network port

```bash
docker run -d -p 4000:80 nginx
open http://192.168.99.100:4000
```

## Ps

```bash
docker ps
```

## Start

```bash
docker start <name>/<id>
```

## Stop

```bash
docker stop <name>/<id>
```

## Rm

```bash
docker rm <name>/<id>
```

## Top

```bash
docker top
```

## Logs

```bash
docker logs <name>/<id>
```

## Inspect

```bash
docker inspect <name>/<id>
```

## Kill

```bash
docker kill <name>/<id>
```

## Stats

```bash
docker stats <name>/<id>
```

## Search

```bash
docker search -s 5 nginx
```

- **-s**: Only displays with at least x stars

## Exec

- Executes a command in a container

```bash
docker exec -it <name>/<id> sh
```

## Data Management Commands

- `docker system prune`
- `docker volume prune`
- `docker network prune`
- `docker container prune`
- `docker image prune`

## More

### Delete old containers

```bash
docker ps -a | grep 'weeks ago' | awk '{print $1}' | xargs docker rm
```

### Delete stopped containers

```bash
docker rm -v $(docker ps -a -q -f status=exited)
```
