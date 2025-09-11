# Stage 1: build
FROM node:18-bullseye AS builder

RUN apt-get update && apt-get install -y ffmpeg ca-certificates curl
RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY transcoding-service/package.json transcoding-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY transcoding-service/tsconfig*.json ./
COPY transcoding-service/src ./src
COPY proto ./proto

RUN pnpm build

# Stage 2: run
FROM node:18-bullseye AS runner

RUN apt-get update && apt-get install -y ffmpeg ca-certificates curl
RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY transcoding-service/package.json transcoding-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /usr/src/app/dist ./dist
COPY proto ./proto

CMD ["node", "dist/main.js"]
