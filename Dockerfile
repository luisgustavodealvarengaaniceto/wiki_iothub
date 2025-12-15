FROM node:20-bookworm-slim AS base

# Install libssl1.1 and openssl in base image (used by all stages)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends wget ca-certificates \
	&& echo "deb http://deb.debian.org/debian bullseye main" > /etc/apt/sources.list.d/bullseye.list \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends libssl1.1 openssl \
	&& rm -rf /var/lib/apt/lists/*

# 1. Install dependencies only when needed
FROM base AS deps
RUN apt-get update \
	&& apt-get install -y --no-install-recommends wget ca-certificates \
	&& echo "deb http://deb.debian.org/debian bullseye main" > /etc/apt/sources.list.d/bullseye.list \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends libssl1.1 openssl \
	&& rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure libssl1.1 is present in builder stage
RUN apt-get update \
	&& apt-get install -y --no-install-recommends libssl1.1 openssl \
	&& rm -rf /var/lib/apt/lists/*

# Use temp SQLite during build to allow Next.js pre-render to run
ENV DATABASE_URL=file:/tmp/prod.db
RUN mkdir -p /tmp && touch /tmp/prod.db

# Generate Prisma Client
RUN npx prisma generate

# Apply schema to temp DB so Next.js can query during build
RUN npx prisma db push --force-reset

# Build Next.js
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
	&& apt-get install -y --no-install-recommends wget ca-certificates \
	&& echo "deb http://deb.debian.org/debian bullseye main" > /etc/apt/sources.list.d/bullseye.list \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends libssl1.1 openssl \
	&& rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create data directory for SQLite
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma db push --skip-generate && npx tsx prisma/seed.ts || true && node server.js"]
