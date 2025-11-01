FROM node:20-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY libs ./libs
COPY src ./src
RUN pnpm build

FROM deps AS prod-deps
RUN pnpm prune --prod

FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 4200
CMD ["node", "dist/src/main"]
