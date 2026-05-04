FROM node:20-alpine AS base
WORKDIR /repo

# ── Manifestes workspace (layer cacheable) ────────────────────────────────────
COPY package.json package-lock.json turbo.json ./
COPY packages/ui-kit/package.json  ./packages/ui-kit/
COPY tools/tsconfig/package.json   ./tools/tsconfig/
COPY carein-suite/package.json     ./carein-suite/

RUN npm ci --ignore-scripts

# ── Sources ───────────────────────────────────────────────────────────────────
COPY packages/ ./packages/
COPY tools/    ./tools/
COPY carein-suite/ ./carein-suite/

RUN npx turbo build --filter=carein-suite

# ── Image finale (légère) ─────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

COPY --from=base /repo/carein-suite/.next/standalone ./
COPY --from=base /repo/carein-suite/.next/static     ./.next/static
COPY --from=base /repo/carein-suite/public           ./public

EXPOSE 3001
CMD ["node", "server.js"]
