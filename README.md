# SYA Monorepo

This repository contains the different services that form the **SYA** project. It is managed using [Turborepo](https://turbo.build/) with [pnpm](https://pnpm.io/) workspaces.

## Project structure

```
apps/      - runnable applications
  api/     - Rust API using Actix Web
  web/     - Next.js frontend
packages/  - shared libraries and configuration
  eslint-config/      - shared ESLint configs
  typescript-config/  - shared TypeScript configs
  ui/                 - React component library
```

## Commands

Run tasks through the root `package.json` scripts:

```bash
pnpm dev         # start all apps in development mode
pnpm lint        # run ESLint in all packages
pnpm check-types # run TypeScript type checks
pnpm build       # build all applications and packages
```

The Rust API can also be built and run via `cargo` or using `docker-compose`.

## Docker

`docker-compose.yml` provides services for the API and an optional `ollama` service used during development.

```bash
docker compose up --build
```

## License

MIT
