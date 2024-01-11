# *****************************
# *** STAGE 1: Dependencies ***
# *****************************
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

### APP
# Install dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add git
RUN yarn --frozen-lockfile

# *****************************
# ****** STAGE 2: Build *******
# *****************************
FROM node:18-alpine AS builder
RUN apk add --no-cache --upgrade libc6-compat bash

# pass commit sha and git tag to the app image
ARG GIT_COMMIT_SHA
ENV NEXT_PUBLIC_GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ARG GIT_TAG
ENV NEXT_PUBLIC_GIT_TAG=$GIT_TAG

ENV NODE_ENV production

### APP
# Copy dependencies and source code
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy scripts
COPY --chmod=+x ./scripts/setup-env-development.sh ./
COPY --chmod=+x ./scripts/setup-env-production.sh ./
COPY --chmod=+x ./scripts/migrate-and-start.sh ./

# Copy ENVs files
RUN chmod +x setup-env-development.sh && ./setup-env-development.sh
RUN chmod +x setup-env-production.sh && ./setup-env-production.sh

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Generate swagger json
RUN yarn next-swagger-doc-cli next-swagger-doc.json

# Prisma generate Database
RUN yarn prisma generate && chmod -R 777 ./node_modules/.prisma

# Build app for production
RUN yarn build

# *****************************
# ******* STAGE 3: Run ********
# *****************************
# Production image, copy all the files and run next
FROM node:18-alpine AS runner
RUN apk add --no-cache --upgrade bash curl jq unzip

### APP
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
#COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/migrate-and-start.sh .

RUN chmod +x migrate-and-start.sh
RUN chmod +x prisma

# Copy ENVs files
COPY --from=builder /app/.env .
COPY --from=builder /app/.env.production .

RUN ["chmod", "-R", "777", "./public"]

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["./migrate-and-start.sh"]
