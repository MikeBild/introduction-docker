FROM node:8.12.0-alpine

LABEL name "nodejs-app"
STOPSIGNAL SIGINT
ENV SERVICE_PORT=8080
EXPOSE 8080

RUN apk add --no-cache dumb-init

HEALTHCHECK --interval=1m --timeout=3s \
  CMD curl -f http://localhost:8080/ || exit 1

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --production
COPY . /app

ENTRYPOINT dumb-init npm start