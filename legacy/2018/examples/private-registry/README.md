# Docker Private-Registry Setup

__Docker-Machine Setup__

```bash
docker-machine create -d virtualbox private-registry
docker-machine env private-registry
eval $(docker-machine env private-registry)
```

## Prepare Configuration

* [htpasswd bcrypt encryption](http://aspirine.org/htpasswd_en.html)

## Build & Run

```bash
docker build -t private-registry .
docker run -it -p 5000:5000 private-registry
```

__Registry Frontend__
```bash
docker run -d -e ENV_DOCKER_REGISTRY_HOST=192.168.99.101 -e ENV_DOCKER_REGISTRY_PORT=5000  -e ENV_DOCKER_REGISTRY_USE_SSL=1  -p 8080:80 konradkleine/docker-registry-frontend:v2
```

## How to use

```bash
docker login localhost:5000
docker build -t localhost:5000/nodejs-example .
docker push localhost:5000/nodejs-example
```

__Run__
```bash
docker run -it -p 9090:80 --name nodejs-example localhost:5000/nodejs-example
```

__Inspect__
```bash
docker pull localhost:5000/nodejs-example
docker image inspect localhost:5000/nodejs-example
docker image history localhost:5000/nodejs-example
```

