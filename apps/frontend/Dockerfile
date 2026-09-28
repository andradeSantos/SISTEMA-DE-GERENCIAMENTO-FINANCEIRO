# Dockerfile de Produção para o Frontend (Next.js 15)
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copia arquivos de manifesto do monorepo
COPY package.json package-lock.json turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Instala dependências
RUN npm ci

# Copia código-fonte
COPY packages/ ./packages/
COPY apps/frontend/ ./apps/frontend/
RUN mkdir -p apps/frontend/public

# Compila shared e Next.js
RUN npm run build --workspace=@app-finance/shared

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build --workspace=frontend

# -------------------------------------------------------------
# Runner de Produção (Next.js Standalone / Production Server)
# -------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4011

# Usuário de sistema não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json

USER nextjs

EXPOSE 4011

CMD ["npm", "run", "start", "--workspace=frontend"]
