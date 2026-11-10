# syntax=docker/dockerfile:1
# TODO 1: Replace the second stage with gcr.io/distroless/nodejs26-debian13:nonroot.
# TODO 2: Distroless already starts node as the entrypoint: CMD becomes ["src/main.ts"], USER node is dropped.

# Stage 1: install only the production dependencies.
FROM node:26-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# Stage 2: the final image – no npm cache, no tests, no build tooling.
FROM node:26-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
USER node
EXPOSE 3000
CMD ["node", "src/main.ts"]
