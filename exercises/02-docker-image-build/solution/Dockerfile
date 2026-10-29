# syntax=docker/dockerfile:1

# Stage 1: nur die Production Dependencies installieren.
FROM node:26-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# Stage 2: das fertige Image – ohne npm-Cache, ohne Tests, ohne Build-Werkzeug.
FROM node:26-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
USER node
EXPOSE 3000
CMD ["node", "src/main.ts"]
