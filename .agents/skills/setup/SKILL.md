---
name: setup
description: >-
  Skill determinista para inicializacao de projetos monorepo do zero.
  Use quando o usuario pedir para criar um novo projeto, inicializar um monorepo,
  ou configurar a estrutura base de um projeto fullstack com Turborepo + Next.js + NestJS + Prisma.
  Tambem ativar quando o usuario disser "setup", "criar projeto", "inicializar projeto",
  "novo monorepo", ou "scaffold".
---

# Setup — Inicializacao de Projeto Monorepo

Este skill cria a estrutura completa de um projeto monorepo padronizado usando:

- **Turborepo** — orquestracao do monorepo
- **Next.js** — frontend (porta 4011)
- **NestJS** — backend (porta 4012)
- **Prisma** — ORM do banco de dados (pacote compartilhado)

> **IMPORTANTE**: Siga cada passo na ordem exata. Nao pule etapas.
> Todos os comandos devem ser executados no diretorio do workspace do usuario.

---

## Parametros

Antes de executar, colete do usuario:

| Parametro        | Obrigatorio | Default         | Descricao                          |
|------------------|-------------|-----------------|-------------------------------------|
| NOME_PROJETO     | Sim         | —               | Nome do projeto (kebab-case)        |
| PORTA_FRONTEND   | Nao         | 4011            | Porta do Next.js                    |
| PORTA_BACKEND    | Nao         | 4012            | Porta do NestJS                     |
| SPEC_PATH        | Nao         | spec.md         | Caminho do arquivo de especificacao |

Se SPEC_PATH for fornecido ou existir um arquivo spec.md na raiz, leia-o e extraia:
- Modelos do Prisma (tabelas, campos, enums, relacionamentos)
- Modulos do NestJS a serem gerados
- Rotas do Frontend a serem criadas
- Variaveis de ambiente adicionais

---

## Passo 1 — Criar o Turborepo

`ash
npx create-turbo@latest NOME_PROJETO -m npm
`

Apos a criacao, entre no diretorio NOME_PROJETO/.

### Verificacao
- Confirme que turbo.json existe na raiz.
- Confirme que package.json existe com workspaces configurado.

---

## Passo 2 — Limpar estrutura padrao do Turborepo

O Turborepo cria apps de exemplo. Remova-os:

`ash
rm -rf apps/docs apps/web
`

### Verificacao
- A pasta apps/ deve estar vazia.

---

## Passo 3 — Criar o Frontend (Next.js)

`ash
npx create-next-app@latest apps/frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
`

### Configurar porta (default 4011)

Edite apps/frontend/package.json e altere os scripts dev e start:

`json
{
  "scripts": {
    "dev": "next dev -p PORTA_FRONTEND",
    "build": "next build",
    "start": "next start -p PORTA_FRONTEND",
    "lint": "next lint"
  }
}
`

### Criar rotas do frontend (se spec disponivel)

Se a spec define rotas, crie as pastas e arquivos page.tsx correspondentes em apps/frontend/src/app/.
Exemplo para a spec padrao:

`
apps/frontend/src/app/
  (auth)/login/page.tsx
  (auth)/register/page.tsx
  dashboard/page.tsx
  cartoes/page.tsx
  gastos/page.tsx
  rendas/page.tsx
`

Cada page.tsx deve ter um componente minimo funcional exportado como default:

`	sx
export default function NomeDaPagina() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Nome Da Pagina</h1>
    </main>
  );
}
`

### Verificacao
- apps/frontend/package.json existe com porta correta nos scripts.
- Todas as rotas da spec existem como page.tsx.

---

## Passo 4 — Criar o Backend (NestJS)

`ash
npm i -g @nestjs/cli
nest new backend --package-manager npm --skip-git
`

Mova para apps/:

`ash
mv backend apps/backend
`

### Configurar porta (default 4012)

Edite apps/backend/src/main.ts:

`	ypescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:PORTA_FRONTEND' });
  await app.listen(process.env.PORT ?? PORTA_BACKEND);
}
bootstrap();
`

### Gerar modulos do backend (se spec disponivel)

Se a spec define modulos, gere cada um com o NestJS CLI:

`ash
cd apps/backend
nest g resource auth --no-spec
nest g resource cards --no-spec
nest g resource incomes --no-spec
nest g resource expenses --no-spec
nest g resource dashboard --no-spec
`

### Verificacao
- apps/backend/src/main.ts existe com porta correta e CORS habilitado.
- Modulos da spec estao gerados em apps/backend/src/.

---

## Passo 5 — Configurar o Prisma (packages/database)

Crie o pacote compartilhado:

`ash
mkdir -p packages/database/src
mkdir -p packages/database/prisma
`

### packages/database/package.json

`json
{
  "name": "database",
  "version": "0.0.0",
  "private": true,
  "main": "./src/client.ts",
  "types": "./src/client.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "latest"
  },
  "devDependencies": {
    "prisma": "latest",
    "tsx": "latest"
  }
}
`

### packages/database/src/client.ts

`	ypescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '@prisma/client';
`

### packages/database/prisma/schema.prisma (Gerado a partir da spec)

Se a spec define o modelo de dados, gere o schema completo. Para a spec padrao do app-finance:

`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum MetodoPagamento {
  CARTAO_CREDITO
  CARTAO_DEBITO
  PIX
  BOLETO
  DINHEIRO
  OUTRO
}

model User {
  id        String    @id @default(uuid())
  nome      String
  email     String    @unique
  senha     String
  criadoEm  DateTime  @default(now()) @map("criado_em")

  cartoes   Card[]
  rendas    Income[]
  gastos    Expense[]

  @@map("users")
}

model Card {
  id                    String    @id @default(uuid())
  usuarioId             String    @map("usuario_id")
  nome                  String
  instituicaoFinanceira String    @map("instituicao_financeira")
  ultimosDigitos        String?   @map("ultimos_digitos")
  criadoEm              DateTime  @default(now()) @map("criado_em")

  usuario               User      @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  gastos                Expense[]

  @@index([usuarioId])
  @@map("cards")
}

model Income {
  id              String   @id @default(uuid())
  usuarioId       String   @map("usuario_id")
  descricao       String
  valor           Decimal  @db.Decimal(10, 2)
  dataRecebimento DateTime @map("data_recebimento")
  categoria       String
  recorrente      Boolean  @default(false)
  recebido        Boolean  @default(true)
  criadoEm        DateTime @default(now()) @map("criado_em")

  usuario         User     @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@index([usuarioId])
  @@map("incomes")
}

model Expense {
  id                  String          @id @default(uuid())
  usuarioId           String          @map("usuario_id")
  cartaoId            String?         @map("cartao_id")
  descricao           String
  valor               Decimal         @db.Decimal(10, 2)
  dataPagamento       DateTime        @map("data_pagamento")
  categoria           String
  metodoPagamento     MetodoPagamento @default(PIX) @map("metodo_pagamento")
  totalParcelas       Int             @default(1) @map("total_parcelas")
  parcelaAtual        Int             @default(1) @map("parcela_atual")
  recorrente          Boolean         @default(false)
  pago                Boolean         @default(false)
  grupoParcelamentoId String?         @map("grupo_parcelamento_id")
  criadoEm            DateTime        @default(now()) @map("criado_em")

  usuario             User            @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  cartao              Card?           @relation(fields: [cartaoId], references: [id], onDelete: SetNull)

  @@index([usuarioId])
  @@index([cartaoId])
  @@index([grupoParcelamentoId])
  @@map("expenses")
}
`

### Verificacao
- packages/database/prisma/schema.prisma contém todos os modelos da spec.
- packages/database/src/client.ts existe com singleton do PrismaClient.

---

## Passo 6 — Criar arquivo .env

Na RAIZ do monorepo, crie .env:

`nv
# =============================================
# Banco de Dados
# =============================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_finance?schema=public"

# =============================================
# Autenticacao
# =============================================
JWT_SECRET="COLOQUE_SEU_SECRET_AQUI"

# =============================================
# Portas
# =============================================
FRONTEND_PORT=4011
BACKEND_PORT=4012

# =============================================
# URLs
# =============================================
NEXT_PUBLIC_API_URL="http://localhost:4012"
`

Crie tambem .env.example com os mesmos campos mas sem valores sensiveis:

`nv
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
JWT_SECRET=""
FRONTEND_PORT=4011
BACKEND_PORT=4012
NEXT_PUBLIC_API_URL="http://localhost:4012"
`

Garanta que .gitignore contem:

`
.env
.env.local
.env.*.local
`

### Verificacao
- .env existe com todas as variaveis da spec.
- .env.example existe.
- .gitignore ignora .env.

---

## Passo 7 — Instalar dependencias

`ash
npm install
`

### Verificacao
- node_modules/ existe na raiz.
- Sem erros de resolucao de workspaces.

---

## Passo 8 — Configurar turbo.json

`json
{
  "schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    }
  }
}
`

### Verificacao
- turbo.json contem os pipelines build, dev, lint, db:generate, db:push, db:seed.

---

## Estrutura Final Esperada

`
NOME_PROJETO/
  apps/
    frontend/              # Next.js (porta 4011)
      src/app/
        (auth)/login/page.tsx
        (auth)/register/page.tsx
        dashboard/page.tsx
        cartoes/page.tsx
        gastos/page.tsx
        rendas/page.tsx
      package.json
    backend/               # NestJS (porta 4012)
      src/
        auth/
        cards/
        incomes/
        expenses/
        dashboard/
        main.ts
      package.json
  packages/
    database/              # Prisma compartilhado
      prisma/
        schema.prisma
        seed.ts
      src/
        client.ts
      package.json
  .env
  .env.example
  .gitignore
  turbo.json
  package.json
  spec.md
`

---

## Checklist Final

- [ ] turbo.json existe e esta configurado
- [ ] apps/frontend/ existe com Next.js na porta correta
- [ ] Todas as rotas da spec existem como page.tsx
- [ ] apps/backend/ existe com NestJS na porta correta
- [ ] Todos os modulos da spec estao gerados
- [ ] packages/database/ existe com Prisma e schema completo
- [ ] .env existe com todas as variaveis
- [ ] .env.example existe
- [ ] .gitignore ignora .env
- [ ] npm install executou sem erros
