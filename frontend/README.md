# Frontend

Next.js frontend application for Kalitka.

## Scope

This directory contains the Next.js App Router frontend application structure, configuration, static assets, and local development scripts.

Do not add registration flows, payment screens, VPN controls, or other product UI until the frontend architecture is defined.

## Local Development

Requirements:

- Node.js 20.19 or newer is recommended for the current ESLint dependency tree.
- npm 9 or newer.

Commands:

```bash
npm install
npm run dev
```

The development server starts at:

```text
http://localhost:3000
```

Useful checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Structure

- `src/` - frontend source code
- `src/app/` - Next.js App Router entry points
- `src/features/` - product feature UI modules
- `src/components/` - reusable project components
- `src/shared/` - shared frontend primitives
- `public/` - static assets
- `package.json` - Node.js project metadata and dependencies
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
