# Funktioniert, ist aber groß, langsam zu bauen und läuft als root.
# TODO 1: Base Image auf eine Major-Version festlegen: node:26-slim statt node:latest.
# TODO 2: Zwei Stages: deps installiert mit npm ci --omit=dev, die zweite Stage kopiert nur node_modules, package.json und src.
# TODO 3: Erst package.json und package-lock.json kopieren, dann installieren – so bleibt der Layer im Cache.
# TODO 4: Als User node starten, nicht als root.
# TODO 5: node direkt als CMD starten, nicht über npm start.
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
