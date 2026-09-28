---
name: responsividade-design-neutro
description: >-
  Skill especialista para guiar e executar a transicao do design system do Sistema Financeiro
  para uma paleta monocromatica neutra (preto, cinza e branco) e garantir responsividade impecavel
  em todos os viewports (mobile, tablet, desktop). Use quando o usuario pedir mudancas visuais neutras,
  paleta preto/cinza/branco, responsividade mobile, menu hamburguer/drawer, ou quando disser
  "responsividade", "cores neutras", "design neutro", "preto e branco", "monocromatico".
---

# Skill: Responsividade & Design Monocromático Neutro

Esta skill estabelece o conjunto determinista de regras e padrões para transformar a interface do Sistema Financeiro em um produto de estética **Monochrome Stealth** de altíssimo padrão, assegurando usabilidade tátil perfeita em dispositivos móveis e desktops.

---

## 1. Dicionário de Substituição Cromática (Neon -> Monocromático)

Ao refatorar qualquer arquivo do frontend, siga estritamente esta tabela de mapeamento:

| Padrão Antigo (Neon / Roxo / Rosa) | Novo Padrão Monocromático Neutro |
| :--- | :--- |
| `from-purple-600 via-fuchsia-600 to-pink-500` | `bg-white text-zinc-950 font-semibold hover:bg-zinc-200` |
| `bg-gradient-to-r from-purple-900/40 ...` (Item ativo) | `bg-white/[0.08] text-white border border-white/[0.14]` |
| `shadow-glow-neon` / `shadow-glow-purple` | `shadow-sm` ou `shadow-[0_0_20px_rgba(255,255,255,0.05)]` |
| `border-purple-500/30` / `border-pink-500/30` | `border-white/[0.12]` ou `border-zinc-700` |
| `text-purple-400` / `text-pink-400` (Títulos e labels) | `text-zinc-200` ou `text-white` |
| `text-pink-300` / `text-purple-300` | `text-zinc-400` |
| `.backlight-dome` (gradiente rosa/roxo) | Domo difuso neutro: `radial-gradient(ellipse at bottom, rgba(255,255,255,0.08) 0%, transparent 70%)` |
| Botão Primário Glow (`variant="glow"`) | Botão Branco Minimalista com texto escuro e alto contraste |

> **Atenção:** Os feedbacks funcionais de dinheiro continuam discretos e claros:
> - Entradas/Superávit: `text-emerald-400`, `bg-emerald-500/10`
> - Saídas/Déficit: `text-rose-400`, `bg-rose-500/10`

---

## 2. Padrões de Responsividade Móvel

### 2.1 Shell Adaptativo
```tsx
// Exemplo em layout.tsx
<div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8">
  <div className="w-full max-w-[1440px] min-h-screen sm:min-h-[92vh] bg-[#0f0f12] border-0 sm:border border-white/[0.06] rounded-none sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
```

### 2.2 Navegação e Sidebar
- Em telas `>= lg (1024px)`: Sidebar lateral fixa elegante (`w-64`).
- Em telas `< lg (1024px)`:
  - Header exibe botão de menu hambúrguer (`Menu` / `X`).
  - Sidebar é renderizada como Drawer sobreposto (`fixed inset-0 z-50 bg-black/80 backdrop-blur-md`) com animação de slide ou transição fluida.

### 2.3 Tabelas Responsivas
- Em telas menores, aplicar contêiner com `overflow-x-auto` suave e barra de rolagem estilizada sutil (`scrollbar-thin scrollbar-thumb-zinc-800`), garantindo que nenhuma tabela quebre a largura do viewport nem cause overflow no body.

---

## 3. Checklist de Execução por Tela

1. **Globals & Theme:**
   - [x] Ajustar `app/globals.css` (remover radial rosa do `.backlight-dome`, definir tokens de tema neutro `#09090b`).
   - [x] Implementar `ThemeProvider` e hook `useTheme` para persistência (`localStorage`) e alternância de temas (Monochrome Stealth, Midnight Titanium, Pure Clean Light).
   - [x] Ajustar componentes base em `components/ui/` (`button.tsx`, `card.tsx`, `pill-button.tsx`).
2. **Layout & Shell:**
   - [x] Criar Drawer móvel responsivo em `components/layout/sidebar.tsx`.
   - [x] Adicionar botão de troca rápida de tema no `components/layout/header.tsx` junto com o botão hambúrguer mobile e avatar em tons neutros.
   - [x] Ajustar `components/layout/footer.tsx` para wrap elegante em telas pequenas.
3. **Dashboard (`app/(dashboard)/page.tsx`):**
   - [x] Trocar curva roxa/rosa do SVG em `PerformanceChart` para gradiente monocromático metálico compatível com temas.
   - [x] Grid adaptativo (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
   - [x] Botão de Exportar Resumo (PDF) e Nova Transação alinhados em mobile.
4. **Telas Funcionais (`/rendas`, `/gastos`, `/cartoes`, `/perfil`, `/ia-insights`):**
   - [x] Adicionar painel de seleção de temas visuais na página `/perfil` (Aparência).
   - [x] Substituir badges e botões neon por preto/cinza/branco.
   - [x] Ajustar formulários e modais para `w-full max-w-lg p-5 sm:p-6`.
5. **Verificação de Compilação:**
   - [x] Testar alternador de tema e persistência de preferência.
   - [x] Executar `npm run build` no frontend (14/14 rotas com sucesso).
