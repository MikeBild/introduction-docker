# Dockerfile Basics

### Instructions

- [.dockerignore](https://docs.docker.com/engine/reference/builder/#dockerignore-file)
- [FROM](https://docs.docker.com/engine/reference/builder/#from) - Sets the Base Image for subsequent instructions
- [MAINTAINER](https://docs.docker.com/engine/reference/builder/#maintainer) - Set the Author field of the generated images
- [RUN](https://docs.docker.com/engine/reference/builder/#run) - Execute any commands in a new layer on top of the current image and commit the results
- [CMD](https://docs.docker.com/engine/reference/builder/#cmd) - Provide defaults for an executing container
- [EXPOSE](https://docs.docker.com/engine/reference/builder/#expose) - Informs Docker that the container listens on the specified network ports at runtime. NOTE: does not actually make ports accessible
- [ENV](https://docs.docker.com/engine/reference/builder/#env) - Sets environment variable
- [ADD](https://docs.docker.com/engine/reference/builder/#add) - Copies new files, directories or remote file to container. Invalidates caches. Avoid `ADD` and use `COPY` instead
- [COPY](https://docs.docker.com/engine/reference/builder/#copy) - Copies new files or directories to container
- [ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint) - Configures a container that will run as an executable
- [VOLUME](https://docs.docker.com/engine/reference/builder/#volume) - Creates a mount point for externally mounted volumes or other containers
- [USER](https://docs.docker.com/engine/reference/builder/#user) - Sets the user name for following RUN / CMD / ENTRYPOINT commands
- [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir) - Sets the working directory.
- [ARG](https://docs.docker.com/engine/reference/builder/#arg) - Defines a build-time variable.
- [ONBUILD](https://docs.docker.com/engine/reference/builder/#onbuild) - Adds a trigger instruction when the image is used as the base for another build
- [STOPSIGNAL](https://docs.docker.com/engine/reference/builder/#stopsignal) - Sets the system call signal that will be sent to the container to exit
- [LABEL](https://docs.docker.com/engine/userguide/labels-custom-metadata/) - Apply key/value metadata to your images, containers, or daemons
- [HEALTHCHECK](https://docs.docker.com/engine/reference/builder/#healthcheck) - Instruction tells Docker how to test a container to check that it is still working.

## Basic

```Dockerfile
FROM node:8.12.0-alpine
ENV SERVICE_PORT=80
ENV NODE_ENV=production
EXPOSE 80

ADD . /app
WORKDIR /app
CMD npm install

ENTRYPOINT node server
```

## Advanced

```Dockerfile
FROM node:8.12.0-alpine

STOPSIGNAL SIGINT
ENV SERVICE_PORT=8080
EXPOSE 8080
LABEL name "nodejs-app"

RUN apk add --no-cache dumb-init

HEALTHCHECK --interval=1m --timeout=3s \
  CMD curl -f http://localhost:8080/ || exit 1

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --production
COPY . /app

ENTRYPOINT dumb-init npm start
```
