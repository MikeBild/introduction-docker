# Docker Compose

- Defining and running multi-container Docker applications
- YAML file to configure your application’s services
- Multiple isolated environments on a single host
- Preserve volume data when containers are created
- Only recreate containers that have changed
- Variables and moving a composition between environments

- [Common Cases](#common-cases)
- [Workflow](#workflow)
- [Docker-Compose YAML-File](#docker-compose-yaml-file)
- [Commands to run docker-compose stacks](#commands-to-run-docker-compose-stacks)

## Common Cases

- Development environments
- Automated testing environments
- Single host deployments
- Docker-Swarm deployments

- [Setup](https://docs.docker.com/compose/install/)
- [CLI](https://docs.docker.com/compose/reference/overview/)
- [Compose-File](https://docs.docker.com/compose/compose-file/)

## Workflow

Using Compose is basically a three-step process:

1. Define your app’s environment with a `Dockerfile`
2. Define the services that make up your app in `docker-compose.yml` so they can be run together in an isolated environment.
3. Lastly, run `docker-compose up` and Compose will start and run your entire app.

## Docker-Compose YAML-File

- [Services](https://docs.docker.com/compose/compose-file/#service-configuration-reference)
- [Networks](https://docs.docker.com/compose/compose-file/#network-configuration-reference)
- [Volumes](https://docs.docker.com/compose/compose-file/#volume-configuration-reference)

**`docker-compose.yml`**

```yaml
version: '3'
services:
  web:
    build: .
    environment:
      NODE_ENV: production
      REDIS_HOST: 'redis'
      REDIS_PORT: '6379'
    ports:
      - '8080:8080'
    links:
      - 'redis'
    depends_on:
      - 'redis'
  redis:
    image: redis:4.0.11
```

**`docker-compose.yml`**

```yaml
version: '3'
services:
  app:
    networks:
      - compose-nodejs-redis-app
    deploy:
      replicas: 2
    image: compose-nodejs-redis:1.0.0
    environment:
      NODE_ENV: production
      REDIS_HOST: 'redis'
      REDIS_PORT: '6379'
    depends_on:
      - 'redis'
    ports:
      - '9090:80'
  redis:
    networks:
      - compose-nodejs-redis-app
    image: redis

networks:
  compose-nodejs-redis-app:
    external: true
```

## Commands to run docker-compose stacks

```back
docker-compose
```

### Build all images

With `docker-compose` we can **build** all the images at once running

```bash
docker-compose build
```

### Run a command against a service

```bash
docker-compose run web sh
```

### Start services

**Start `docker-compose.yaml` as default**

```bash
docker-compose up
```

**Detached**

```bash
docker-compose up -d
```

### Logs

```bash
docker-compose logs
```

```bash
docker-compose logs web
```

### List containers

```bash
docker-compose ps
```

### Stop containers

```bash
docker-compose stop
```

```bash
docker-compose stop web
```

### Start container

- Starts existing containers for a service, e.g. `web`:

```bash
docker-compose start web
```

### Remove containers

```bash
docker-compose rm
```

The previous command removes **stopped** service containers.

### Remove all services

```bash
docker-compose down
```
