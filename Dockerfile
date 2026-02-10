# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci

# Stage 2: Build client
FROM deps AS build-client
COPY client/ client/
COPY tsconfig.base.json .
RUN npm run build --workspace=client

# Stage 3: Build server
FROM deps AS build-server
COPY server/ server/
COPY tsconfig.base.json .
RUN npm run build --workspace=server

# Stage 4: Production image
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/
RUN npm ci --workspace=server --omit=dev

COPY --from=build-server /app/server/dist server/dist
COPY --from=build-server /app/server/drizzle server/drizzle
COPY --from=build-server /app/server/src/db/migrate.ts server/src/db/migrate.ts
COPY --from=build-client /app/client/dist client/dist

ENV NODE_ENV=production
EXPOSE 3000

CMD sh -c "npx tsx server/src/db/migrate.ts && node server/dist/index.js"
