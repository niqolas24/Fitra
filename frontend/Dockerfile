# Production image for AWS (App Runner, ECS/Fargate, EC2).
# Build: docker build -t fitra-web .
# Run:  docker run -p 3000:3000 -e AUTH_SECRET=... -e AUTH_URL=https://your-domain -e NEXT_PUBLIC_API_URL=... fitra-web

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG AUTH_SECRET=build-time-placeholder-secret-min-32-chars
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
