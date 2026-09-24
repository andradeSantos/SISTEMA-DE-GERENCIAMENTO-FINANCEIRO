# Projeto: app-finance

## 1. Visao Geral & Arquitetura
- **Monorepo**: Turborepo (npm workspaces)
- **Frontend**: Next.js 14+ (App Router, TailwindCSS, TypeScript) -> Porta 4011
- **Backend**: NestJS (TypeScript, Express, class-validator) -> Porta 4012
- **Banco de Dados**: PostgreSQL com Prisma ORM em packages/database

## 2. Variaveis de Ambiente (.env)
- DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_finance?schema=public"
- JWT_SECRET="chave_secreta_jwt_minimo_32_caracteres_aleatorios"
- FRONTEND_PORT=4011
- BACKEND_PORT=4012
- NEXT_PUBLIC_API_URL="http://localhost:4012"

## 3. Modelo de Dados (Prisma Schema)

### Enums
- MetodoPagamento: CARTAO_CREDITO, CARTAO_DEBITO, PIX, BOLETO, DINHEIRO, OUTRO

### Tabelas

#### users
- id (UUID), nome, email (unique), senha (hash bcrypt), criado_em
- Relacionamentos: cartoes[], rendas[], gastos[]

#### cards
- id (UUID), usuario_id (FK User), nome (ex: "Nubank Roxinho"), instituicao_financeira (ex: "Nubank"), ultimos_digitos (String opcional 4 digitos), criado_em
- Relacionamentos: usuario (User), gastos[] (Expense[])

#### incomes
- id (UUID), usuario_id (FK User), descricao, valor (Decimal 10,2), data_recebimento, categoria, recorrente (Boolean), recebido (Boolean, default true), criado_em
- Relacionamentos: usuario (User)

#### expenses
- id (UUID), usuario_id (FK User), cartao_id (FK Card nullable), descricao, valor (Decimal 10,2), data_pagamento, categoria, metodo_pagamento (Enum), total_parcelas (Int default 1), parcela_atual (Int default 1), recorrente (Boolean), pago (Boolean default false), grupo_parcelamento_id (UUID nullable), criado_em
- Relacionamentos: usuario (User), cartao (Card nullable)

## 4. Modulos do Backend (NestJS)
- **auth**: Registro, login, hash com bcrypt, JWT Guard.
- **cards**: CRUD de cartoes do usuario (listar, cadastrar, renomear, excluir).
- **incomes**: CRUD de rendas, somatorios previsto vs recebido.
- **expenses**: CRUD de despesas, geracao de parcelas agrupadas por grupo_parcelamento_id, associacao opcional com cartao_id quando debito/credito.
- **dashboard**: Agregacao de totais (Receitas, Despesas, Saldo), gastos por categoria, gastos por cartao.

## 5. Rotas do Frontend (Next.js)
- /(auth)/login e /(auth)/register: Autenticacao com validacao Zod.
- /dashboard: Resumo geral e gastos por cartao/categoria.
- /cartoes: Gestao visual dos cartoes cadastrados.
- /gastos: Tabela com badges de status, cartao vinculado, parcelas e modal de criacao.
- /rendas: Tabela e cadastro de fontes de receita.
