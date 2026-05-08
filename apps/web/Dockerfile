FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/design-system/package.json packages/design-system/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install

COPY . .

RUN pnpm --filter @speckit/web build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=base /app ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "--filter", "@speckit/web", "start"]
