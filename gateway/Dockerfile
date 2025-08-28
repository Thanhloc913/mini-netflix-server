# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install   # cài cả devDeps

COPY . .
RUN npx nest build

# Stage 2: run
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --no-frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
