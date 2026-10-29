# Docker Event Monitor

```bash
docker build -t docker-monitor .
docker run -it -v /var/run/docker.sock:/var/run/docker.sock --privileged docker-monitor
```

## Demo Service
```
docker service create --publish 8080:80 --name demo tutum/hello-world
```

## Ubuntu + Docker

```bash
apt-get update
curl -fsSL https://yum.dockerproject.org/gpg | apt-key add -
add-apt-repository \
       "deb https://apt.dockerproject.org/repo/ \
       ubuntu-$(lsb_release -cs) \
       main"
apt-get update
apt-get -y install docker-engine
```
