# Especificação Técnica — Design System Monocromático & Responsividade Adaptativa

**Projeto:** Sistema de Gerenciamento Financeiro (App Finance)  
**Versão:** 3.0 (Monochrome Stealth & Adaptive Mobile-First)  
**Objetivo:** Transição completa da identidade visual para tons neutros (preto, cinza, branco) e garantia de responsividade fluida em todos os dispositivos (mobile, tablet, desktop e telas ultrawide).

---

## 1. Nova Identidade Visual: Monochrome Stealth (Preto, Cinza e Branco)

Abandonamos integralmente a estética neon (roxo/magenta/rosa) em favor de uma linguagem **minimalista, elegante, madura e atemporal**, inspirada em ferramentas financeiras de alto nível (Linear, Vercel, Apple Pro).

### 1.1 Paleta de Cores Monocromática

| Token / Papel | Código Hex / Classe Tailwind | Aplicação no Sistema |
| :--- | :--- | :--- |
| **Fundo Global (Canvas)** | `#09090b` (`bg-zinc-950`) | Canvas de fundo da aplicação inteira |
| **Shell Flutuante Principal** | `#0f0f12` com borda `#27272a` (`border-zinc-800`) | O container envolvente centralizado |
| **Superfície de Cards** | `#141418` com borda `border-white/[0.06]` | Cards de métricas, transações e listas |
| **Superfície Elevada / Modais** | `#18181d` com borda `border-white/[0.1]` | Modais flutuantes e menus suspensos |
| **Texto de Alta Ênfase** | `#ffffff` (`text-white`) | Títulos, valores principais e rótulos ativos |
| **Texto Secundário / Labels** | `#a1a1aa` (`text-zinc-400`) | Subtítulos, cabeçalhos de colunas e datas |
| **Texto Muted / Desabilitado** | `#52525b` (`text-zinc-600`) | Ícones discretos, placeholders e rodapé |
| **Destaque Primário (Ação)** | `#ffffff` fundo com `#000000` texto | Botões principais de ação com alto contraste |
| **Destaque Secundário (Pills)** | `bg-white/[0.08]` com borda `border-white/[0.12]` | Pílulas ativas, tabs e filtros selecionados |

### 1.2 Regras de Eliminação de Cores Neon
- **Remover 100%:** `purple-*`, `fuchsia-*`, `pink-*`, `shadow-glow-neon`, `shadow-glow-purple`.
- **Efeito de Backlight:** O domo iluminado colorido (`.backlight-dome`) passa a emitir uma iluminação difusa branca/prateada suave (`radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)`), criando profundidade sem poluição visual.
- **Gráfico de Evolução SVG:** A linha antes neon roxa/rosa passa a ter gradiente metálico prateado (`#ffffff` a `#71717a`) com sombra difusa monocromática.
- **Feedback Funcional de Saldo:** Preservar exclusivamente para sinalização de números:
  - Receitas / Saldo Positivo: Verde esmeralda suave (`text-emerald-400`, `bg-emerald-500/10`).
  - Despesas / Saldo Negativo: Carmim sutil (`text-rose-400`, `bg-rose-500/10`).

---

## 2. Arquitetura de Responsividade Adaptativa

### 2.1 Breakpoints e Diretrizes de Escala
- **Mobile (< 640px - `sm`):**
  - O Shell flutuante não deve ter padding externo excessivo nem bordas que comprimam a área útil (`p-0 sm:p-6`, `rounded-none sm:rounded-[32px]`).
  - Acesso ao menu via **Drawer deslizante / Hambúrguer** ou barra de navegação inferior compacta.
  - Header empilhado verticalmente, com o seletor de mês e os botões de ação ajustados para toque fácil (`min-h-[44px]`).
  - Grids de 3 colunas quebram para 1 coluna fluida.
- **Tablet (640px a 1023px - `md` a `lg`):**
  - Grid de 2 colunas para cards e cartões.
  - Sidebar compacta ou retrátil com ícones e labels acessíveis.
- **Desktop (>= 1024px - `lg` e `xl`):**
  - Layout integral em 3 colunas com shell flutuante maciço e sidebar lateral fixa.

---

## 3. Modo Troca de Cor (Motor de Temas Dinâmico)

Para oferecer personalização ao usuário e máxima flexibilidade visual, o sistema passa a suportar um **Motor de Troca de Tema/Cor (Theming Engine)** persistente:

### 3.1 Temas Suportados
1. **Monochrome Stealth (Padrão Principal):**
   - Canvas: Preto profundo (`#09090b`), Superfícies: Cinza grafite (`#141418` e `#18181d`), Ações: Branco puro (`#ffffff`), Iluminação: Luz prata difusa.
2. **Midnight Titanium (Modo Alternativo Escuro):**
   - Canvas: Azul titânio ultra escuro (`#0a0d14`), Superfícies: Ardósia profunda (`#101522`), Ações: Prata metálico / Azul gelo suave (`#e2e8f0`).
3. **Pure Clean Light (Modo Claro Sofisticado):**
   - Canvas: Branco / Cinza níquel muito claro (`#fafafa` ou `#f4f4f5`), Superfícies: Branco puro (`#ffffff`) com bordas suaves (`#e4e4e7`), Ações: Preto de alto contraste (`#09090b`), Texto: Preto carvão (`#18181b`).

### 3.2 Arquitetura de Implementação da Troca de Cor
- **Storage & Persistência:** A preferência é salva em `localStorage.getItem('app-finance-theme')` e aplicada como classe no elemento raiz (`<html class="theme-monochrome">` ou data-attribute `data-theme="monochrome | titanium | light"`).
- **Provedor React (`ThemeProvider`):**
  - Contexto React leve para expor `theme`, `setTheme` e `toggleTheme()`.
  - Tratamento para prevenir hydration mismatch.
- **Seletor de Cores na UI:**
  - **No Header:** Botão elegante com ícone (Sol/Lua ou Paleta de Cores) que permite alternar os temas.
  - **Na tela de Perfil (`/perfil`):** Seção dedicada *"Aparência do Sistema"* com visualização em miniatura (cards clicáveis) dos esquemas de cores disponíveis.

---

## 4. Matriz de Componentes e Telas Impactadas

| Componente / Tela | Ajuste Monocromático & Temas | Ajuste de Responsividade |
| :--- | :--- | :--- |
| **Shell & Layout** | Suporte a tokens de tema (fundo e bordas adaptáveis) | Shell sem margem em mobile, cantos arredondados apenas a partir de `sm` |
| **Sidebar Lateral** | Pílula ativa adaptável ao tema | Drawer móvel retrátil com botão de abrir/fechar em telas `< lg` |
| **Header** | Seletor/Toggle de Tema integrado, saudação limpa | Empilhamento responsivo de busca, seletor de data e botões |
| **Dashboard (`/`)** | Cards e gráficos que respondem ao tema ativo | Grid fluido `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| **Gráfico (`PerformanceChart`)**| Curva adaptativa (gradiente metálico prata no escuro, grafite no claro) | `viewBox` responsivo com overflow touch e altura auto-ajustável |
| **Rendas & Gastos** | Badges translúcidos adaptativos | Tabelas com scroll touch horizontal ou cards no mobile |
| **Cartões (`/cartoes`)** | Cartões em Neomorphic adaptado | Grid adaptativo de 1 a 3 colunas |
| **Perfil (`/perfil`)** | Card de seleção de tema visual na aba de preferências | Formulário empilhado em mobile e 2 colunas no desktop |
| **Auth (`/sign-in`, `/sign-up`)**| Fundo e inputs com variáveis de tema | Padding reduzido para telas pequenas |

---

## 5. Fases de Execução do Fluxo

1. **Fase 1: Configuração Base de Estilos, Tokens e Theming**
   - Configurar variáveis CSS / classes de tema em `app/globals.css`.
   - Criar `ThemeProvider` e hook `useTheme` no frontend.
   - Ajustar componentes base (`button.tsx`, `card.tsx`, `pill-button.tsx`).
2. **Fase 2: Layout Shell, Sidebar Responsiva e Header com Toggle**
   - Implementar Drawer/Hambúrguer móvel para a sidebar.
   - Adicionar o botão de troca de tema no Header.
   - Ajustar Header e Footer para flexibilização em telas pequenas.
3. **Fase 3: Dashboard Monocromático, Adaptativo e Dinâmico**
   - Converter `TotalHoldingCard`, `InsightsGlowCard`, `CategoryWatchlist`, `CardsPreviewWidget`.
   - Recalcular estilo da curva em `PerformanceChart` para cinza metálico/branco (e suporte ao tema).
4. **Fase 4: Telas Internas, Seletor no Perfil e Autenticação**
   - Adicionar seletor visual de temas na página `/perfil`.
   - Rendas, Gastos, Cartões e Auth compatíveis com a paleta neutra e tabelas responsivas.
5. **Fase 5: Verificação e Validação**
   - Testar alternância de temas com persistência no `localStorage`.
   - Testar em viewports de 360px (mobile), 768px (tablet), 1024px (laptop) e 1440px (desktop).
   - Build de produção (`npm run build`).
