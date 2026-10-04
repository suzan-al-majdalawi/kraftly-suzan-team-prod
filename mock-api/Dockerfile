# Mock-API: bara Node + express, ingen build
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY mock-api ./mock-api
RUN npm ci --omit=dev --ignore-scripts
COPY mock-api/server.js mock-api/server.js
EXPOSE 4000

CMD ["node", "mock-api/server.js"]