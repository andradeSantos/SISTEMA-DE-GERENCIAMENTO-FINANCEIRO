# Dockerfile de Produção para o Backend (NestJS + Prisma)
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências necessárias para compilação nativa se houver (openssl para Prisma)
RUN apk add --no-cache openssl libc6-compat

# Copia arquivos de manifesto do monorepo
COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY packages/database/prisma ./packages/database/prisma

# Instala todas as dependências
RUN npm ci

# Copia código-fonte
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

# Gera o client do Prisma e compila o shared + backend
RUN npx prisma generate --schema=./packages/database/prisma/schema.prisma
RUN npm run build --workspace=@app-finance/shared
RUN npm run build --workspace=backend

# -------------------------------------------------------------
# Runner de Produção (Imagem Leve e Segura)
# -------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=4012

# Cria usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copia dependências e build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json

USER nestjs

EXPOSE 4012

CMD ["node", "apps/backend/dist/main.js"]
