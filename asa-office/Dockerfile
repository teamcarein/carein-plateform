FROM node:20-alpine AS base
WORKDIR /repo

# ── Manifestes workspace (layer cacheable) ────────────────────────────────────
COPY package.json package-lock.json turbo.json ./
COPY packages/ui-kit/package.json  ./packages/ui-kit/
COPY tools/tsconfig/package.json   ./tools/tsconfig/
COPY asa-office/package.json       ./asa-office/

RUN npm ci --ignore-scripts

# ── Sources ───────────────────────────────────────────────────────────────────
COPY packages/ ./packages/
COPY tools/    ./tools/
COPY asa-office/ ./asa-office/

RUN npx turbo build --filter=carein-console

# ── Image finale (légère) ─────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=base /repo/asa-office/.next/standalone ./
COPY --from=base /repo/asa-office/.next/static     ./.next/static
COPY --from=base /repo/asa-office/public           ./public

EXPOSE 3000
CMD ["node", "server.js"]
