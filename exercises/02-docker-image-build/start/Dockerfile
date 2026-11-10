# Works, but is large, slow to build and runs as root.
# TODO 1: Pin the base image to a major version: node:26-slim instead of node:latest.
# TODO 2: Two stages: deps installs with npm ci --omit=dev, the second stage copies only node_modules, package.json and src.
# TODO 3: Copy package.json and package-lock.json first, then install – that keeps the layer in the cache.
# TODO 4: Run as user node, not as root.
# TODO 5: Start node directly as CMD, not through npm start.
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
