---
name: db-seed
description: >-
  Skill determinista para popular o banco de dados local com dados realistas de teste.
  Use quando o usuario pedir para popular o banco, criar dados de teste, rodar o seed,
  ou quando disser "db-seed", "popular banco", "dados de teste", "seed".
---

# DB Seed — Populacao de Dados de Teste

Este skill cria um script de seed determinista que popula o banco de dados local
com dados realistas para desenvolvimento e testes visuais do frontend.

> **IMPORTANTE**: Este seed so deve ser executado em ambiente de desenvolvimento.
> Ele cria dados ficticios para testes, NUNCA para producao.

---

## Parametros

| Parametro    | Obrigatorio | Default         | Descricao                           |
|-------------|-------------|-----------------|--------------------------------------|
| SPEC_PATH   | Nao         | spec.md         | Caminho da spec para extrair modelos |

---

## Passo 1 — Criar o arquivo de seed

Crie o arquivo packages/database/prisma/seed.ts com o conteudo abaixo.
Adapte os modelos de acordo com a spec do projeto.

Para a spec padrao do app-finance:

`	ypescript
import { PrismaClient, MetodoPagamento } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes (ordem importa por causa das FKs)
  await prisma.expense.deleteMany();
  await prisma.income.deleteMany();
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

  // =============================================
  // 1. Usuario de teste
  // =============================================
  // Senha: senha123 (hash bcrypt gerado previamente)
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      nome: 'Usuario Demo',
      email: 'demo@appfinance.com',
      senha: '/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNFKMO', // senha123
    },
  });
  console.log('Usuario criado:', user.email);

  // =============================================
  // 2. Cartoes do usuario
  // =============================================
  const cartaoNubank = await prisma.card.create({
    data: {
      id: randomUUID(),
      usuarioId: user.id,
      nome: 'Nubank Roxinho',
      instituicaoFinanceira: 'Nubank',
      ultimosDigitos: '4829',
    },
  });

  const cartaoItau = await prisma.card.create({
    data: {
      id: randomUUID(),
      usuarioId: user.id,
      nome: 'Itau Personalite',
      instituicaoFinanceira: 'Itau',
      ultimosDigitos: '1092',
    },
  });
  console.log('Cartoes criados:', cartaoNubank.nome, cartaoItau.nome);

  // =============================================
  // 3. Rendas
  // =============================================
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  await prisma.income.createMany({
    data: [
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Salario',
        valor: 8500.00,
        dataRecebimento: new Date(anoAtual, mesAtual, 5),
        categoria: 'Salario',
        recorrente: true,
        recebido: true,
      },
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Freelance - Projeto Web',
        valor: 2500.00,
        dataRecebimento: new Date(anoAtual, mesAtual, 15),
        categoria: 'Freelance',
        recorrente: false,
        recebido: true,
      },
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Dividendos FIIs',
        valor: 320.50,
        dataRecebimento: new Date(anoAtual, mesAtual, 20),
        categoria: 'Investimentos',
        recorrente: true,
        recebido: false,
      },
    ],
  });
  console.log('Rendas criadas: 3 registros');

  // =============================================
  // 4. Gastos avulsos (sem parcelamento)
  // =============================================
  await prisma.expense.createMany({
    data: [
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Aluguel',
        valor: 2200.00,
        dataPagamento: new Date(anoAtual, mesAtual, 10),
        categoria: 'Moradia',
        metodoPagamento: MetodoPagamento.PIX,
        recorrente: true,
        pago: true,
      },
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Supermercado Extra',
        valor: 487.32,
        dataPagamento: new Date(anoAtual, mesAtual, 8),
        categoria: 'Alimentacao',
        metodoPagamento: MetodoPagamento.CARTAO_DEBITO,
        cartaoId: cartaoItau.id,
        pago: true,
      },
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Netflix',
        valor: 55.90,
        dataPagamento: new Date(anoAtual, mesAtual, 1),
        categoria: 'Lazer',
        metodoPagamento: MetodoPagamento.CARTAO_CREDITO,
        cartaoId: cartaoNubank.id,
        recorrente: true,
        pago: true,
      },
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Gasolina',
        valor: 250.00,
        dataPagamento: new Date(anoAtual, mesAtual, 12),
        categoria: 'Transporte',
        metodoPagamento: MetodoPagamento.CARTAO_DEBITO,
        cartaoId: cartaoItau.id,
        pago: true,
      },
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Conta de Luz',
        valor: 189.45,
        dataPagamento: new Date(anoAtual, mesAtual, 15),
        categoria: 'Moradia',
        metodoPagamento: MetodoPagamento.BOLETO,
        recorrente: true,
        pago: false,
      },
      {
        id: randomUUID(),
        usuarioId: user.id,
        descricao: 'Padaria - Pao e Cafe',
        valor: 32.00,
        dataPagamento: new Date(anoAtual, mesAtual, 7),
        categoria: 'Alimentacao',
        metodoPagamento: MetodoPagamento.DINHEIRO,
        pago: true,
      },
    ],
  });
  console.log('Gastos avulsos criados: 6 registros');

  // =============================================
  // 5. Gasto parcelado (Notebook 10x no Nubank)
  // =============================================
  const grupoNotebook = randomUUID();
  const parcelasNotebook = Array.from({ length: 10 }, (_, i) => ({
    id: randomUUID(),
    usuarioId: user.id,
    descricao: 'Notebook Dell Inspiron',
    valor: 499.90,
    dataPagamento: new Date(anoAtual, mesAtual - 3 + i, 25),
    categoria: 'Eletronicos',
    metodoPagamento: MetodoPagamento.CARTAO_CREDITO as MetodoPagamento,
    cartaoId: cartaoNubank.id,
    totalParcelas: 10,
    parcelaAtual: i + 1,
    recorrente: false,
    pago: i < 4, // As 4 primeiras parcelas ja foram pagas
    grupoParcelamentoId: grupoNotebook,
  }));

  await prisma.expense.createMany({ data: parcelasNotebook });
  console.log('Parcelas do Notebook criadas: 10 registros (4 pagas, 6 pendentes)');

  // =============================================
  // Resumo
  // =============================================
  const totalUsers = await prisma.user.count();
  const totalCards = await prisma.card.count();
  const totalIncomes = await prisma.income.count();
  const totalExpenses = await prisma.expense.count();

  console.log('\n--- Seed finalizado com sucesso! ---');
  console.log('Usuarios:', totalUsers);
  console.log('Cartoes:', totalCards);
  console.log('Rendas:', totalIncomes);
  console.log('Gastos:', totalExpenses);
  console.log('\nLogin de teste: demo@appfinance.com / senha123');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`

### Verificacao
- packages/database/prisma/seed.ts existe com dados realistas.

---

## Passo 2 — Configurar o seed no Prisma

Edite packages/database/package.json e adicione a configuracao do seed:

`json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
`

### Verificacao
- package.json contem a chave prisma.seed.

---

## Passo 3 — Instalar dependencia tsx

`ash
cd packages/database
npm install tsx --save-dev
`

### Verificacao
- tsx esta listado em devDependencies.

---

## Passo 4 — Executar o seed

`ash
cd packages/database
npx prisma db seed
`

Ou pela raiz do monorepo:

`ash
npx turbo db:seed
`

### Verificacao
- Console exibe contagem de registros criados.
- Rodar npx prisma studio mostra os dados populados.

---

## Dados Criados pelo Seed Padrao

### Usuario
| Email                  | Senha    |
|------------------------|----------|
| demo@appfinance.com    | senha123 |

### Cartoes (2)
| Nome               | Banco   | Digitos |
|--------------------|---------|---------|
| Nubank Roxinho     | Nubank  | 4829    |
| Itau Personalite   | Itau    | 1092    |

### Rendas (3)
| Descricao                 | Valor      | Recebido |
|---------------------------|------------|----------|
| Salario                   | R$ 8.500  | Sim      |
| Freelance - Projeto Web   | R$ 2.500  | Sim      |
| Dividendos FIIs           | R$ 320,50 | Nao      |

### Gastos Avulsos (6)
| Descricao        | Valor      | Metodo         | Cartao    | Pago |
|------------------|------------|----------------|-----------|------|
| Aluguel          | R$ 2.200  | PIX            | —         | Sim  |
| Supermercado     | R$ 487,32 | Debito         | Itau      | Sim  |
| Netflix          | R$ 55,90  | Credito        | Nubank    | Sim  |
| Gasolina         | R$ 250    | Debito         | Itau      | Sim  |
| Conta de Luz     | R$ 189,45 | Boleto         | —         | Nao  |
| Padaria          | R$ 32     | Dinheiro       | —         | Sim  |

### Gasto Parcelado (10 registros)
| Descricao              | Parcela | Valor    | Cartao | Pago |
|------------------------|---------|----------|--------|------|
| Notebook Dell Inspiron | 1/10    | R$ 499,90 | Nubank | Sim  |
| Notebook Dell Inspiron | 2/10    | R$ 499,90 | Nubank | Sim  |
| Notebook Dell Inspiron | 3/10    | R$ 499,90 | Nubank | Sim  |
| Notebook Dell Inspiron | 4/10    | R$ 499,90 | Nubank | Sim  |
| Notebook Dell Inspiron | 5/10    | R$ 499,90 | Nubank | Nao  |
| ...                    | ...     | ...      | ...    | ...  |
| Notebook Dell Inspiron | 10/10   | R$ 499,90 | Nubank | Nao  |

---

## Checklist Final

- [ ] packages/database/prisma/seed.ts existe
- [ ] package.json contem prisma.seed configurado
- [ ] tsx esta instalado como devDependency
- [ ] npx prisma db seed executa sem erros
- [ ] Prisma Studio mostra todos os dados populados
