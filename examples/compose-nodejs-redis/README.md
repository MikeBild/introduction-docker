# NodeJS + Redis Docker-Compose

## Build & Run in Docker

```bash
docker build -t compose-nodejs-redis:1.0.0 .
docker run -it -p 8080:8080 compose-nodejs-redis:1.0.0
```

## Change the container internal service port

```bash
docker run -it -p 8080:8080 -e SERVICE_PORT=8080 compose-nodejs-redis:1.0.0
```

## Publish to registry

```bash
docker tag compose-nodejs-redis:1.0.0 mikebild/compose-nodejs-redis:1.0.0
docker push mikebild/compose-nodejs-redis:1.0.0
```

## Start/Stop Services using Docker-Compose

```bash
docker-compose -f docker-compose.yml up
```

```bash
curl -XPOST http://192.168.99.100:8080/redis
curl http://192.168.99.100:8080/redis
```

```bash
docker-compose -f docker-compose.yml down
```
