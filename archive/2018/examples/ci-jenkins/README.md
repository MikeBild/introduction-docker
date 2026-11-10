# CI/CD with Jenkins

```bash
docker-machine create -d virtualbox jenkins
docker-machine env jenkins
eval $(docker-machine env jenkins)
```

```bash
mkdir jenkins-data
docker build -t myjenkins .
docker run -d -p 8080:8080 -p 50000:50000 -v $(pwd)/jenkins-data:/var/jenkins_home -v $(which docker):/usr/bin/docker -v /var/run/docker.sock:/var/run/docker.sock --privileged=true --name myjenkins myjenkins
docker logs myjenkins --follow
```
## CI Build

```bash
open "http://$(docker-machine ip jenkins):8080"
```

* Enter the item name (e.g. "docker-test"), select "Freestyle project" and click OK
* On the configuration page, click "Add build step" then "Execute shell"
* In the command box enter `sudo docker run hello-world`
* Click "Save"
* Click "Build Now"

## CI Build & Push & Run Example

```
sudo docker rm webdemo -f
sudo docker run -d -p 9090:80 --name webdemo tutum/hello-world
```
