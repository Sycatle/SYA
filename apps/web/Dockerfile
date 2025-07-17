# apps/web/Dockerfile

# -------- Build stage --------
FROM node:20-alpine AS builder

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copie du monorepo
COPY . .

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Build de l'interface web
RUN pnpm --filter ./apps/web... run build

# -------- Runtime stage --------
FROM node:20-alpine AS runner

ENV NODE_ENV=production

# Enable pnpm in runtime
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copie des dépendances et de l'application compilée
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web

EXPOSE 3000

CMD ["pnpm", "--filter", "./apps/web", "start"]

# -------- Dev stage --------
FROM builder AS dev

CMD ["pnpm", "--filter", "./apps/web", "dev"]
