# Stage 1: build
FROM node:18-alpine AS builder

RUN npm install -g pnpm
WORKDIR /usr/src/app

# copy package + lock từ auth-service
COPY auth-service/package.json auth-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# copy tsconfig và source code
COPY auth-service/tsconfig*.json ./
COPY auth-service/src ./src

# copy proto (nằm ngoài service)
COPY proto ./proto  

RUN pnpm build


# Stage 2: run
FROM node:18-alpine AS runner

RUN npm install -g pnpm
WORKDIR /usr/src/app

# copy package + lock để cài deps runtime
COPY auth-service/package.json auth-service/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# copy dist từ stage build
COPY --from=builder /usr/src/app/dist ./dist
# copy proto để runtime cũng có thể load
COPY proto ./proto  

CMD ["node", "dist/main.js"]
