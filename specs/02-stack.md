# Charts Generator — Tech Stack

---

# 1. Stack Options

## Option A — Full-Separation (Next.js + NestJS + PostgreSQL)

### Overview

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | Next.js 14 (App Router), React, TypeScript    |
| Backend  | NestJS, REST JSON API                         |
| Database | PostgreSQL + Prisma ORM                       |
| Cache    | Redis (sessions, rate limiting, AI cache)     |
| Infra    | Docker Compose (dev), GitHub Actions (CI/CD)  |
| Monorepo | Turborepo + pnpm workspaces                   |

### UI Strategy

- **Styling approach**: Tailwind CSS — utility-first, compile-time purge, zero runtime overhead
- **Component strategy**: Hybrid — shadcn/ui as the copy-owned component layer on top of Radix UI primitives
- **Design-system implementation**: Separate `packages/design-system` workspace package; tokens as CSS custom properties + TypeScript constants; components built on Radix + CVA variants; patterns as layout composition components
- **Pattern support capability**: Full — patterns are first-class workspace package exports consumed by all apps
- **AI UI generation friendliness**: Highest — Next.js + Tailwind + shadcn/ui + Radix is the most widely represented stack in LLM training data; AI tools generate idiomatic code with minimal correction

---

## Option B — Monolithic Next.js (T3 Stack)

### Overview

| Layer    | Technology                                       |
|----------|--------------------------------------------------|
| Frontend | Next.js 14 (App Router), React, TypeScript       |
| Backend  | Next.js API Routes (no separate process)         |
| Database | PostgreSQL + Prisma ORM                          |
| Cache    | Redis (optional; sessions via iron-session)      |
| Infra    | Vercel (frontend + API), GitHub Actions          |
| Monorepo | Single Next.js app; no separate backend package  |

### UI Strategy

- **Styling approach**: Tailwind CSS — same as Option A
- **Component strategy**: shadcn/ui + Radix UI — same as Option A
- **Design-system implementation**: `src/design-system/` folder inside the Next.js app; no separate workspace package; harder to enforce import boundaries across a future second app
- **Pattern support capability**: Partial — patterns can be co-located but cannot be enforced as a strict package boundary without a monorepo
- **AI UI generation friendliness**: High — same frontend stack as Option A; AI familiarity is equal on the UI side; tRPC types reduce boilerplate but have a steeper learning curve for AI tools generating backend code

---

## Option C — Remix + Fastify + Drizzle

### Overview

| Layer    | Technology                                       |
|----------|--------------------------------------------------|
| Frontend | Remix (v2), React, TypeScript                    |
| Backend  | Fastify, REST JSON API                           |
| Database | PostgreSQL + Drizzle ORM                         |
| Cache    | Redis                                            |
| Infra    | Docker Compose, GitHub Actions                   |
| Monorepo | Turborepo + pnpm workspaces                      |

### UI Strategy

- **Styling approach**: Tailwind CSS — same as Options A/B
- **Component strategy**: Radix UI primitives with custom wrappers; no shadcn/ui (shadcn targets Next.js CLI; manual setup required in Remix)
- **Design-system implementation**: `packages/design-system` workspace package — structurally identical to Option A, but Remix's nested-route model adds complexity to pattern slot composition
- **Pattern support capability**: Moderate — Remix outlet model does not map cleanly to the slot-based pattern API described in the architecture spec
- **AI UI generation friendliness**: Lower — Remix has significantly less LLM training data coverage than Next.js; Drizzle ORM is also underrepresented vs Prisma; more AI-generated code will require correction

---

# 2. Comparison Table

| Criterion                    | Option A (Next.js + NestJS) | Option B (T3 / Monolithic Next.js) | Option C (Remix + Fastify) |
|------------------------------|-----------------------------|------------------------------------|----------------------------|
| **Dev speed**                | High                        | Very High (single deploy unit)     | Medium                     |
| **Scalability**              | High (separate scaling)     | Medium (API and UI scale together) | High                       |
| **Cost**                     | Medium (two containers)     | Low (single Vercel deployment)     | Medium (two containers)    |
| **AI friendliness**          | Very High                   | High                               | Low–Medium                 |
| **UI consistency control**   | Very High (package boundary)| Medium (folder convention only)    | High                       |
| **Design-system compat.**    | Very High                   | Medium                             | Medium                     |

---

# 3. Final Selection

## Option A: Next.js + NestJS + PostgreSQL

### MVP Speed

Next.js App Router with shadcn/ui provides the fastest path to production-quality UI. The shadcn/ui CLI scaffolds accessible components in seconds; Tailwind eliminates bespoke CSS authoring. NestJS CLI scaffolds modules, controllers, and services with a single command. Prisma generates a fully type-safe client from a schema, eliminating handwritten SQL.

### Long-Term Scalability

Separating the Next.js frontend from the NestJS API means each layer can be scaled independently. The API is stateless and horizontal-scaling-ready behind a load balancer. Redis caching absorbs duplicate AI prompt load. PostgreSQL with PgBouncer handles the target 1,000 concurrent users without architectural change.

### AI-Driven Development

The combination of Next.js + Tailwind + shadcn/ui + Radix UI + CVA represents the single most widely trained-on frontend stack in modern LLMs. Cursor, GPT-4o, and Claude consistently generate idiomatic, correct code for this stack with minimal post-generation correction. NestJS decorators and Prisma schema are equally well-represented. This maximises the value of AI-assisted development throughout the project.

### Design System Enforcement

A Turborepo monorepo with `packages/design-system` as a first-class workspace package creates a hard import boundary. ESLint `no-restricted-imports` can enforce `@speckit/design-system` as the only allowed UI import in the `apps/` layer. This is architecturally impossible to achieve with a folder-only convention in Option B. The 4-layer model (tokens → components → patterns → pages) maps directly to subdirectories of this package, and each layer is independently testable and publishable.

---

# 4. Final Stack

## Frontend

| Concern           | Choice                                                           |
|-------------------|------------------------------------------------------------------|
| Framework         | Next.js 14 (App Router, SSR + CSR)                              |
| Language          | TypeScript (strict mode)                                         |
| Styling system    | Tailwind CSS v3                                                  |
| Component system  | shadcn/ui (copy-owned components over Radix UI)                  |
| Behavior prims    | Radix UI (Dialog, Dropdown, Tooltip, Select, etc.)               |
| Variant system    | class-variance-authority (CVA)                                   |
| Utility merge     | tailwind-merge + clsx                                            |
| State management  | Zustand (minimal global state: auth user, active chart)          |
| Server state      | TanStack Query (React Query v5) for async data fetching          |
| Chart rendering   | ECharts via `echarts-for-react`                                  |
| i18n              | next-intl                                                        |

## Backend

| Concern         | Choice                                 |
|-----------------|----------------------------------------|
| Framework       | NestJS v10                             |
| Language        | TypeScript (strict mode)               |
| API style       | REST JSON, base path `/api/v1`         |
| Validation      | class-validator + class-transformer    |
| Auth            | @nestjs/jwt + @nestjs/passport         |
| AI integration  | OpenAI SDK (server-side only)          |
| LLM validation  | Zod (structured output schema check)   |

## Database

| Concern     | Choice                                              |
|-------------|-----------------------------------------------------|
| Primary DB  | PostgreSQL 16                                       |
| ORM         | Prisma (migrations, type-safe client)               |
| Cache/store | Redis 7 (refresh tokens, AI response cache)         |

## Infra

| Concern   | Choice                                                                 |
|-----------|------------------------------------------------------------------------|
| Dev env   | Docker Compose (Next.js + NestJS + PostgreSQL + Redis)                 |
| Monorepo  | Turborepo + pnpm workspaces                                            |
| CI/CD     | GitHub Actions (lint → typecheck → test → build → deploy)              |
| Staging   | Deploy on merge to `main`                                              |
| Prod      | Deploy on release tag                                                  |

---

# 5. UI System Implementation Plan

## 5.1 Design System

### Where Tokens Live

```
packages/design-system/
  tokens/
    colors.ts        # color palette as CSS custom property names + JS constants
    spacing.ts       # spacing scale (4px base grid)
    typography.ts    # font sizes, weights, line heights
    radius.ts        # border radius scale
    shadow.ts        # box shadow scale
    index.ts         # re-exports all token maps
    globals.css      # :root { --color-primary: ...; ... } definitions
```

All tokens are defined once in `globals.css` as CSS custom properties and mirrored in TypeScript constants for use in CVA variant maps. No page or pattern file may reference a raw hex value, pixel value, or string literal in place of a token.

### How Components Are Built

Each component in `packages/design-system/components/` follows this structure:

```ts
// Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  // base classes — maps to token CSS vars
  'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-[var(--color-on-primary)]',
        ghost:   'bg-transparent hover:bg-[var(--color-surface-hover)]',
      },
      size: {
        sm: 'h-8 px-3 text-[var(--font-size-sm)]',
        md: 'h-10 px-4 text-[var(--font-size-md)]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  state?: 'idle' | 'loading' | 'empty' | 'error';
}

export function Button({ variant, size, state, className, ...props }: ButtonProps) {
  // ...
}
```

All styling goes through CVA variant maps that reference CSS custom property tokens. The `className` prop is merged via `cn()` (tailwind-merge + clsx) so consumers can pass additional utility classes if needed — but direct token overrides via `className` are blocked by ESLint rule.

### How Patterns Are Implemented

Patterns live in `packages/design-system/patterns/` and are composed entirely from design-system components:

```ts
// patterns/AppLayout.tsx
import { Sidebar, TopNav, Main } from '../components';

export interface AppLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function AppLayout({ sidebar, children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>{sidebar}</Sidebar>
      <div className="flex flex-1 flex-col">
        <TopNav />
        <Main>{children}</Main>
      </div>
    </div>
  );
}
```

Patterns accept content via named props (slots), own all structural layout, and export from `packages/design-system/index.ts`.

---

## 5.2 Pattern Support

### Layout Abstraction

Each pattern encapsulates one reusable layout structure. The full set defined in the architecture spec maps to files as follows:

| Pattern        | File                                      | Slot Props                          |
|----------------|-------------------------------------------|-------------------------------------|
| `AppLayout`    | `patterns/AppLayout.tsx`                  | `sidebar`, `children`               |
| `SplitLayout`  | `patterns/SplitLayout.tsx`                | `direction`, `ratio`, `children`    |
| `FormPattern`  | `patterns/FormPattern.tsx`                | `fields`, `actions`                 |
| `TablePattern` | `patterns/TablePattern.tsx`               | `columns`, `data`, `state`, `pagination` |
| `PanelPattern` | `patterns/PanelPattern.tsx`               | `header`, `children`, `footer`      |

All patterns accept a `state` prop (`'loading' | 'empty' | 'error' | 'idle'`) and render the appropriate `Spinner`, `EmptyState`, or `ErrorState` component automatically.

### How Pages Compose Patterns

Pages import patterns and components exclusively from `@speckit/design-system`. They pass data and callbacks as props; they never define layout markup directly:

```tsx
// apps/web/app/(dashboard)/page.tsx
import { AppLayout, SplitLayout } from '@speckit/design-system';
import { ChartHistoryList } from '@/features/charts/ChartHistoryList';
import { ChartDisplayPanel }  from '@/features/charts/ChartDisplayPanel';
import { PromptInputPanel }   from '@/features/ai/PromptInputPanel';

export default function DashboardPage() {
  return (
    <AppLayout sidebar={<ChartHistoryList />}>
      <SplitLayout direction="vertical" ratio={[70, 30]}>
        <ChartDisplayPanel />
        <PromptInputPanel />
      </SplitLayout>
    </AppLayout>
  );
}
```

---

## 5.3 AI Constraints Support

### Preventing Raw Styling

ESLint rule `no-restricted-syntax` blocks `JSXAttribute[name.name="style"]` in all files under `apps/`. Inline `style={{}}` props are a lint error, not a convention.

### Enforcing Component Usage

ESLint rule `no-restricted-imports` allows only `@speckit/design-system` as a source of React components in `apps/`. Local component file creation outside `packages/design-system/` is blocked by a custom ESLint rule that flags `export default function` and `export function` in any file under `apps/**/components/`.

### Ensuring Consistency

Cursor rules (`.cursor/rules/`) codify the above as AI constraints. Any code generated by Cursor or another LLM for the `apps/` layer is checked against:

1. All JSX must use components imported from `@speckit/design-system`
2. All page-level layout must use a named pattern from `@speckit/design-system/patterns`
3. No `style={{}}`, no `className` with raw hex/pixel values outside the design-system package
4. All user-visible strings must use `useTranslations()` from next-intl — no string literals in JSX
5. All async data must be fetched via `useAsyncState<T>()` — no raw `useEffect` + `useState` pairs

These rules are enforced in CI via ESLint and in the editor via Cursor rules so violations are caught before code review.

---

# 6. Risks & Trade-offs

## UI System Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Design-system package grows large and slow to iterate | Medium | Keep tokens, components, and patterns as separate Turborepo tasks; only rebuild what changed |
| Team adds one-off components directly to apps/ under deadline pressure | High | ESLint + CI gate blocks it; PR checklist item enforces design-system-first rule |
| Token naming inconsistency as the palette grows | Medium | Generate token constants from a single source (Figma tokens plugin or `tokens/index.ts` as master); never hand-edit generated files |
| CVA variant explosion per component | Low | Limit to `variant` + `size` + `state`; all other customisation via composition |

## AI Generation Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| AI generates raw Tailwind in page files, bypassing design-system | High | ESLint + Cursor rules prevent it; AI is instructed via rules to only import from `@speckit/design-system` |
| AI invents new layout structures instead of using patterns | High | Pattern names and slot shapes documented in Cursor rules file; AI uses them by reference |
| AI generates hardcoded color/spacing strings | Medium | Token lint rule catches hex and px literals outside the design-system package |
| AI uses wrong state management pattern (`useEffect` + `useState` for async) | Medium | `useAsyncState` is documented in the Cursor rules; ESLint can flag raw `useEffect` in feature files |

## Complexity vs Control Trade-off

| Trade-off | Decision |
|-----------|----------|
| Two-service deployment (Next.js + NestJS) vs single Vercel deploy | Accept the complexity: AI proxy isolation and independent scaling justify separate services |
| Turborepo monorepo overhead vs simplicity of a single app | Accept the overhead: the `packages/design-system` boundary is architecturally critical and cannot be simulated with a folder convention |
| shadcn/ui copy-owned components vs a third-party design library | Prefer copy-owned: full control over tokens, variants, and accessibility implementation; no version lock-in |
| Synchronous AI generation (v1) vs job queue | Start synchronous (< 10s acceptable); add BullMQ + SSE in v2 if P99 latency exceeds tolerance |
