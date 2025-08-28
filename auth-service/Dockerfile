# Stage 1: build
FROM node:18-alpine AS builder

RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


# Stage 2: run
FROM node:18-alpine AS runner

RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
