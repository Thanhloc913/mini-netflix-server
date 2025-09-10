# Stage 1: build
FROM node:18-alpine AS builder

RUN npm install -g pnpm
WORKDIR /usr/src/app

# copy package + lock từ movie-service
COPY movie-service/package.json movie-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# copy tsconfig và source code
COPY movie-service/tsconfig*.json ./
COPY movie-service/src ./src

# copy proto (nằm ngoài service)
COPY proto ./proto  

RUN pnpm build


# Stage 2: run
FROM node:18-alpine AS runner

RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY movie-service/package.json movie-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /usr/src/app/dist ./dist
COPY proto ./proto  

CMD ["node", "dist/main.js"]
