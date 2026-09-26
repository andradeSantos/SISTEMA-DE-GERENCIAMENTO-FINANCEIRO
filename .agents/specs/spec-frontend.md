# Especificação Técnica v2.3 — Frontend Premium: SISTEMA FINANCEIRO

**Bíblia Visual de Referência:** *Helios Investments Dashboard (media_1790431118067.png)*  
**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons  
**Integração no Monorepo:** Turborepo / npm workspaces com `@app-finance/shared` e `@app-finance/database`

---

## 1. Dissecação da Bíblia Visual & Design System (UI/UX)

A imagem de referência dita todas as regras estéticas e estruturais desta nova fase:

### 1.1 Paleta de Cores e Atmosfera Dark Mode
- **Canvas / Background Externo:** `#0a0a0c` com iluminação ambiente e reflexos volumétricos escuros.
- **Painel Principal / Shell Envolvente:** Card gigante com borda muito suave (`rounded-[28px] sm:rounded-[36px]`), background `#0f0f13` e borda translúcida sutil (`border border-white/[0.06]`).
- **Cards e Superfícies Internas:** `#14141b` a `#181822`, cantos arredondados (`rounded-2xl` a `rounded-3xl`), sombra profunda e borda delicada (`border border-white/[0.05]`).
- **Gradients Neon & Glow (Assinatura Visual):**
  - **Gradiente Primário:** Roxo magenta para rosa neon (`linear-gradient(135deg, #a855f7 0%, #ec4899 100%)`).
  - **Luz Volumétrica de Fundo (Backlight Glow):** Efeito de domo iluminado (radial blur) emergindo de trás de cards e botões interativos (ex: botão *Explorar Insights de IA*).
  - **Sombra Glow Neon:** `box-shadow: 0 0 25px -4px rgba(236, 72, 153, 0.4)`.

### 1.2 Sidebar (Menu Lateral Idêntico à Referência em Português)
- **Localização:** Coluna fixa à esquerda integrada ao shell escuro.
- **Logo / Header da Sidebar:** Ícone geométrico estilizado + Nome da Aplicação (*App Finance*).
- **Item Ativo (Pill Neon Glow):** 
  - Fundo em pílula larga com gradiente roxo/rosa suave translúcido (`bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-transparent`).
  - Borda luminosa sutil e contorno em pílula (`rounded-2xl`).
  - Ícone e texto em branco de alto contraste (`text-white font-medium`).
- **Itens Inativos:** Ícone discreto + texto em tom de cinza neutro (`text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] transition-all`).
- **Seção Superior:** *Dashboard* (`/`), *Rendas* (`/rendas`), *Gastos* (`/gastos`), *Cartões* (`/cartoes`), *Perfil* (`/perfil`).
- **Seção Inferior (Fixa):** *Configurações* (`/perfil`) e *Suporte* (`/ia-insights`) com divisória transparente.

### 1.3 Cabeçalho Dinâmico (Header Superior 100% Real em Português)
- **Saudação Personalizada (Esquerda):**
  - Título proeminente: `Bem-vindo(a), {user.nome}` consumido da API (`/auth/me`).
  - Subtítulo: *"Aqui está a visão geral do seu patrimônio e finanças"*.
- **Controles Centrais/Direita:**
  - Navegador de meses em formato de pílulas agrupadas ([`MonthNavigator`](file:///c:/Users/Renatchinha/OneDrive/Documentos/Documentos/Documentos/Rafael%20Andrade/appFinance/apps/frontend/components/dashboard/month-navigator.tsx)).
  - Barra de busca rápida (*"Buscar transações..."*).
  - Botão de Notificações com badge discreto.
  - Avatar e Perfil do Usuário com inicial dinâmica, nome e badge *"Conta Ativa"*, linkando diretamente para `/perfil`.
  - Botão de Logout com limpeza de cookies HttpOnly e sessão.

### 1.4 Footer Global Estruturado com Health Check Real
- Rodapé refinado na base do shell com polling dinâmico de status da API (`GET /health`):
  - `🟢 API Conectada (Xms)` quando operacional e responsiva.
  - `🔴 API Desconectada` em caso de falha de conexão.
  - `🟡 Verificando API...` durante a checagem.
  - Resumo de versão, porta do backend e copyright.

---

## 2. Dashboard Encorpado e Robusto (Superando o Escopo Minimalista)

O novo Dashboard é dividido em um grid modular com alto nível de detalhamento visual:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Bem-vindo(a), {Nome} | Navegador [Mês/Ano] | [Exportar PDF] | [+ Nova Transação]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. SALDO CONSOLIDADO (TOTAL HOLDING)  │ 2. GASTOS POR CATEGORIA │ 3. MEUS CARTÕES     │
│    - Saldo Real (Feedback Cromático)  │    - Participação % real│    - Mini-cards de  │
│    - Entradas vs Saídas do Mês        │    - Sem dados fictícios│      crédito com    │
│    - Card com Backlight Glow Neon     │    - Abas: Maiores/Menor│      bandeira real  │
│      ("Decisões com IA" -> /ia-insights)                        │    - Link 'Ver todos│
├───────────────────────────────────────┴─────────────────────────┴─────────────────────┤
│ 4. EVOLUÇÃO DO SALDO (GRÁFICO COM CURVA BÉZIER MATEMÁTICA REAL)                       │
│    - Curva SVG fluida que sobe no superávit e desce no déficit real do usuário        │
│    - Tooltip interativo por mês (saldo acumulado, diferença líquida em R$)            │
│    - Controles de escala em pílulas: [ 1D ] [ 1S ] [ 1M ] [ 6M ] [ 1A ]               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. TRANSAÇÕES RECENTES                                                                 │
│    - Tabela moderna com dados reais unificados de receitas e despesas.                 │
│    - Toggle instantâneo de status (Pago / Pendente).                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Feedback Cromático Rigoroso
- **Saldo Positivo:** `text-emerald-400` com badge verde neon (`bg-emerald-500/10 border-emerald-500/20`).
- **Saldo Negativo:** `text-rose-400` com badge vermelho/rosa neon (`bg-rose-500/10 border-rose-500/20`).

---

## 3. Adaptação e Harmonização Visual de Todas as Telas

Todas as rotas do sistema devem abandonar designs utilitários simples e adotar com fidelidade absoluta a mesma identidade visual da Bíblia *Helios*:

### 3.1 Rota de Rendas / Receitas (`/rendas`)
- **Header da Página:** Título estilizado em gradiente sutil, totalizador do período com badge positivo e botão Neon Glow `+ Nova Renda`.
- **Filtros Rápidos em Pílulas:** Seletores arredondados de status: `[ Todas ] [ Recebidas ] [ Pendentes ] [ Recorrentes ]`.
- **Tabela Dark de Alto Padrão:**
  - Linhas com efeito hover sutil (`hover:bg-white/[0.02]`), sem bordas pesadas.
  - Badges translúcidos em pílula para categorias com pontuações cromáticas.
  - Status em badge iluminado com ícones minimalistas (`CheckCircle2` verde neon vs `Clock` âmbar).
- **Modal de Inclusão com Backlight Glow:** Card escuro flutuante com blur no fundo e botão de submissão em gradiente neon.

### 3.2 Rota de Gastos / Despesas (`/gastos`)
- **Header da Página:** Totalizador mensal de despesas com indicador cromático de impacto no saldo e botão `+ Nova Despesa`.
- **Filtros Rápidos em Pílulas:** `[ Todas ] [ Pagas ] [ Pendentes ] [ Parceladas ] [ Por Cartão ]`.
- **Tabela de Despesas Avançada:**
  - Indicador interativo de toggle pago/pendente em um clique com animação suave.
  - Tag estilizada em pílula para compras parceladas (`X/Y parcelas` com contorno rosa/roxo sutil).
  - Chip identificador do cartão vinculado com ícone de bandeira e nome do cartão.
  - Formatação monetária negativa com tipografia proeminente em `text-rose-400`.
- **Modal de Nova Despesa:**
  - Seletor moderno de Método de Pagamento (`PIX`, `Cartão de Crédito`, `Boleto`, etc.).
  - Campo condicional de vínculo com Cartão ativo.
  - Simulador de parcelamento em tempo real (exibindo valor unitário da parcela e total).

### 3.3 Rota de Cartões (`/cartoes`)
- **Galeria Visual de Cartões (Estilo Apple Wallet / Neomorphic Dark):**
  - Cartões renderizados como réplicas físicas digitais com gradientes escuros refinados (`from-zinc-900 to-black`), chips EMV estilizados, instituição financeira e últimos 4 dígitos em tipografia mono.
  - Barra de progresso visual de fatura / gastos acumulados do mês por cartão com gradiente neon.
  - Indicador de status ativo e atalho rápido para ver apenas gastos daquele cartão.
- **Modal de Novo Cartão:** Interface minimalista para cadastro de nome, instituição financeira e 4 dígitos finais.

### 3.4 Rotas de Autenticação (`/sign-in` e `/sign-up`)
- **Estética Dark Volumétrica:** Card centralizado dentro do canvas com Backlight Glow radial (domo neon roxo/rosa no topo).
- Logotipo estilizado da Helios / App Finance.
- Inputs escuros com foco neon suave e botão primário com sombra luminosa `shadow-glow`.

---

## 4. Arquitetura Monorepo, Contratos & Segurança

### 4.1 Consumo do `@app-finance/shared`
- Tipagem ponta a ponta:
  - DTOs de Autenticação: `LoginDto`, `RegisterDto`.
  - DTOs de Gastos: `CreateExpenseDto`, `UpdateExpenseDto`.
  - DTOs de Rendas: `CreateIncomeDto`, `UpdateIncomeDto`.
  - DTOs de Cartões: `CreateCardDto`, `UpdateCardDto`.
  - Enums: `MetodoPagamento` (`CARTAO_CREDITO`, `CARTAO_DEBITO`, `PIX`, `BOLETO`, `DINHEIRO`, `OUTRO`).
  - Respostas do Dashboard: `DashboardResponse`, `DashboardResumo`, etc.

### 4.2 Sessão JWT via Cookies HttpOnly (`withCredentials: true`)
- Cliente HTTP (`api-client.ts`) com `credentials: 'include'`.
- Backend configurado com `cookie-parser` e CORS completo (`credentials: true`, porta `4011`).
- Cookies protegidos contra leitura client-side (`httpOnly: true`, `SameSite=Lax/Strict`).

### 4.3 Middleware de Proteção de Rotas (`middleware.ts`)
- Executado no Edge Runtime do Next.js.
- Verifica o cookie `auth_token`.
- Redireciona usuários anônimos para `/sign-in?callbackUrl=...`.
- Redireciona usuários autenticados em `/sign-in` e `/sign-up` de volta para o Dashboard (`/`).
- Injeta cabeçalhos de defesa: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.

### 4.4 Prevenção contra Vulnerabilidades XSS
- **Proibição Absoluta:** O uso de `dangerouslySetInnerHTML` é expressamente vetado em todos os arquivos `.tsx`.
- Escape de caracteres nativo do React em todas as listagens.
- Sanitização de entradas através dos schemas Zod com `react-hook-form`.

---

## 5. Regras de Negócio e Formulários

### 5.1 Máscaras de Moeda e Parsing Numérico
- Campo `CurrencyInput`:
  - Entrada visual: `R$ 1.250,00`.
  - Envio à API: número puro float/decimal (`1250.00`).

### 5.2 CRUD de Gastos
- Campos mandatórios:
  - `descricao`: texto.
  - `valor`: valor unitário da parcela ou total.
  - `dataPagamento`: data no padrão ISO.
  - `categoria`: string.
  - `metodoPagamento`: enum `MetodoPagamento`.
  - `totalParcelas`: inteiro (se > 1, gera N parcelas automaticamente).
  - `recorrente`: booleano.
  - `cartaoId`: obrigatório/condicional se método for cartão.

### 5.3 Persistência Temporal via URL
- Search Params: `?mes=X&ano=Y`.
- Hook `useMonthFilter()` encapsula a sincronização, garantindo que F5, compartilhamento de link e paginação mantenham o período ativo.

---

## 6. Estrutura de Arquivos Recomendada (`apps/frontend`)

```text
apps/frontend/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                # Layout escuro com card centralizado e backlight glow
│   │   ├── sign-in/page.tsx          # Login com Zod
│   │   └── sign-up/page.tsx          # Cadastro com Zod
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Shell macro: Sidebar lateral fixa + Top Header + Footer
│   │   ├── page.tsx                  # Dashboard encorpado (Grid idêntico à referência)
│   │   ├── rendas/page.tsx           # Tabela rica de Rendas adaptada ao novo padrão visual
│   │   ├── gastos/page.tsx           # Tabela rica de Gastos adaptada ao novo padrão visual
│   │   └── cartoes/page.tsx          # Galeria Neomorphic Dark de cartões adaptada
│   │
│   ├── api/auth/                     # Route Handlers de Cookie BFF
│   │   ├── set-cookie/route.ts
│   │   └── logout/route.ts
│   │
│   ├── globals.css                   # Tailwind v4 com utilitários de Backlight Glow, gradients e scrollbar
│   └── layout.tsx                    # Root Layout com tema Dark
│
├── components/
│   ├── layout/                       # Componentes estruturais do layout
│   │   ├── sidebar.tsx               # Sidebar idêntica à referência (com pill ativa e ícones)
│   │   ├── header.tsx                # Header com boas-vindas, busca, pill buttons e profile
│   │   └── footer.tsx                # Rodapé do sistema com status da API
│   │
│   ├── ui/                           # Componentes atômicos
│   │   ├── button.tsx                # Botão com variantes glow neon e pill
│   │   ├── card.tsx                  # Card com bordas arredondadas e efeito depth
│   │   ├── pill-button.tsx           # Botão em pílula para filtros de tempo
│   │   ├── badge.tsx                 # Badges cromáticos de status
│   │   └── input.tsx                 # Inputs escuros com foco neon
│   │
│   ├── dashboard/                    # Componentes modulares do novo dashboard
│   │   ├── total-holding-card.tsx    # Card principal de Saldo + Patrimônio
│   │   ├── insights-glow-card.tsx    # Card com backlight glow (rosa/roxo)
│   │   ├── category-watchlist.tsx    # Ranking de gastos por categoria
│   │   ├── cards-preview-widget.tsx  # Miniatura dos cartões e faturas
│   │   ├── performance-chart.tsx     # Gráfico com curva SVG fluida e tooltip neon
│   │   └── recent-transactions.tsx   # Tabela refinada de transações recentes
│   │
│   └── forms/                        # Formulários com Zod
│       ├── currency-input.tsx        # Máscara monetária BRL
│       ├── transaction-modal.tsx     # Modal unificado de Nova Transação (Receita ou Despesa)
│       └── card-modal.tsx            # Modal de cadastro de cartões
│
├── hooks/
│   ├── use-month-filter.ts           # Sincronização temporal via URL Search Params
│   └── use-auth.ts                   # Estado do usuário autenticado
│
├── services/
│   └── api-client.ts                 # Cliente fetch com credentials: 'include'
│
└── middleware.ts                     # Proteção de rotas com JWT HttpOnly
```
