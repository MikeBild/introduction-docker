FROM node:8.12.0-alpine

EXPOSE 8080
ENV SERVICE_PORT=8080
ENV NODE_ENV=production
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

RUN apk add --no-cache dumb-init

ADD . /app
WORKDIR /app
RUN npm install

ENTRYPOINT dumb-init npm start
