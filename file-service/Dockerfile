# Stage 1: build
FROM node:18-alpine AS builder

RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY file-service/package.json file-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY file-service/tsconfig*.json ./
COPY file-service/src ./src
COPY proto ./proto

RUN pnpm build

# Stage 2: run
FROM node:18-alpine AS runner

RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY file-service/package.json file-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist
COPY proto ./proto

CMD ["node", "dist/main.js"]
