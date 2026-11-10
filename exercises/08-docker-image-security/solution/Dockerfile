# syntax=docker/dockerfile:1

# Stage 1: install the dependencies with npm – npm and the shell stay in this stage.
FROM node:26-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# Stage 2: Distroless – only Node.js and its libraries, no shell, no package manager.
# The tag nonroot runs as user 65532. The entrypoint is already node.
FROM gcr.io/distroless/nodejs26-debian13:nonroot
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
EXPOSE 3000
CMD ["src/main.ts"]
