# Charts Generator — Project Scaffold

---

# 1. Monorepo Structure

```
speckit/
├── apps/
│   ├── web/                          # Next.js 14 frontend (App Router)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # Dashboard (chart workspace)
│   │   │   │   └── charts/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx  # Single chart view
│   │   │   ├── layout.tsx            # Root layout (providers, fonts)
│   │   │   ├── globals.css           # Imports design-system tokens globals
│   │   │   └── not-found.tsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/       # LoginForm, RegisterForm (use @speckit/ui)
│   │   │   │   ├── hooks/            # useLogin, useRegister
│   │   │   │   └── api/              # auth API client calls
│   │   │   ├── charts/
│   │   │   │   ├── components/       # ChartHistoryList, ChartDisplayPanel
│   │   │   │   ├── hooks/            # useCharts, useChart, useSaveChart
│   │   │   │   └── api/              # charts API client calls
│   │   │   └── ai/
│   │   │       ├── components/       # PromptInputPanel, GeneratingIndicator
│   │   │       ├── hooks/            # useGenerateChart
│   │   │       └── api/              # AI API client calls
│   │   ├── shared/
│   │   │   ├── hooks/
│   │   │   │   ├── useAsyncState.ts  # Canonical async state hook
│   │   │   │   └── useAuth.ts        # Auth session access
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts     # Axios/fetch wrapper with base URL
│   │   │   │   └── query-client.ts   # TanStack Query client singleton
│   │   │   └── store/
│   │   │       └── index.ts          # Zustand store (auth, active chart)
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   └── zh.json
│   │   ├── public/
│   │   ├── next.config.mjs
│   │   ├── tailwind.config.ts        # Extends from packages/config/tailwind
│   │   ├── tsconfig.json             # Extends from packages/config/tsconfig
│   │   └── package.json
│   │
│   └── api/                          # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   ├── jwt.strategy.ts
│       │   │   │   │   └── local.strategy.ts
│       │   │   │   ├── guards/
│       │   │   │   │   └── jwt-auth.guard.ts
│       │   │   │   └── dto/
│       │   │   │       ├── register.dto.ts
│       │   │   │       └── login.dto.ts
│       │   │   ├── users/
│       │   │   │   ├── users.module.ts
│       │   │   │   ├── users.controller.ts
│       │   │   │   ├── users.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── update-user.dto.ts
│       │   │   ├── charts/
│       │   │   │   ├── charts.module.ts
│       │   │   │   ├── charts.controller.ts
│       │   │   │   ├── charts.service.ts
│       │   │   │   └── dto/
│       │   │   │       ├── create-chart.dto.ts
│       │   │   │       └── chart-response.dto.ts
│       │   │   └── ai/
│       │   │       ├── ai.module.ts
│       │   │       ├── ai.controller.ts
│       │   │       ├── ai.service.ts
│       │   │       ├── prompt-builder.ts
│       │   │       ├── response-parser.ts
│       │   │       ├── schemas/
│       │   │       │   └── chart-output.schema.ts  # Zod schema for LLM output
│       │   │       └── dto/
│       │   │           └── generate-chart.dto.ts
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   │   └── public.decorator.ts        # @Public() route marker
│       │   │   ├── filters/
│       │   │   │   └── http-exception.filter.ts   # Uniform error envelope
│       │   │   ├── interceptors/
│       │   │   │   └── response.interceptor.ts    # Wraps response in { success, data }
│       │   │   └── pipes/
│       │   │       └── validation.pipe.ts
│       │   ├── prisma/
│       │   │   ├── prisma.module.ts
│       │   │   └── prisma.service.ts
│       │   └── app.module.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── test/
│       ├── .env
│       ├── .env.example
│       ├── tsconfig.json             # Extends from packages/config/tsconfig
│       └── package.json
│
├── packages/
│   ├── design-system/                # Core UI system (CRITICAL)
│   │   ├── tokens/
│   │   │   ├── color.ts
│   │   │   ├── spacing.ts
│   │   │   ├── typography.ts
│   │   │   ├── radius.ts
│   │   │   ├── shadow.ts
│   │   │   ├── globals.css           # CSS custom properties (:root)
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Input.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Card.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Badge/
│   │   │   ├── Spinner/
│   │   │   ├── Avatar/
│   │   │   ├── Toast/
│   │   │   ├── EmptyState/
│   │   │   ├── ErrorState/
│   │   │   └── index.ts              # Barrel export for all components
│   │   ├── patterns/
│   │   │   ├── AppLayout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── AppLayout.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── SplitLayout/
│   │   │   │   ├── SplitLayout.tsx
│   │   │   │   ├── SplitLayout.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── FormPattern/
│   │   │   │   ├── FormPattern.tsx
│   │   │   │   ├── FormPattern.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── TablePattern/
│   │   │   ├── PanelPattern/
│   │   │   └── index.ts              # Barrel export for all patterns
│   │   ├── hooks/
│   │   │   └── index.ts              # useAsyncState, useDisclosure, etc.
│   │   ├── utils/
│   │   │   ├── cn.ts                 # tailwind-merge + clsx helper
│   │   │   └── index.ts
│   │   ├── index.ts                  # Public API: tokens + components + patterns + hooks
│   │   ├── tsconfig.json
│   │   └── package.json              # name: "@speckit/design-system"
│   │
│   ├── ui/                           # Thin re-export layer
│   │   ├── index.ts                  # re-exports everything from @speckit/design-system
│   │   ├── tsconfig.json
│   │   └── package.json              # name: "@speckit/ui"
│   │
│   └── config/                       # Shared build configs
│       ├── eslint/
│       │   ├── base.js               # Base ESLint rules
│       │   ├── next.js               # Next.js-specific rules + UI governance
│       │   └── nest.js               # NestJS-specific rules
│       ├── tsconfig/
│       │   ├── base.json             # Shared strict tsconfig
│       │   ├── nextjs.json           # Next.js tsconfig extension
│       │   └── nestjs.json           # NestJS tsconfig extension
│       ├── tailwind/
│       │   └── base.ts               # Shared Tailwind preset
│       └── package.json              # name: "@speckit/config"
│
├── docker-compose.yml                # PostgreSQL + Redis for local dev
├── turbo.json                        # Turborepo pipeline config
├── pnpm-workspace.yaml
├── .env.example                      # Root-level env template
└── package.json                      # Root workspace package
```

---

# 2. Design System Structure

## Directory Purpose Map

```
packages/design-system/
├── tokens/       → Visual primitives only. No component logic.
├── components/   → Stateless UI atoms/molecules. No business logic.
├── patterns/     → Layout compositions. Composed from components only.
├── hooks/        → Shared UI hooks (state normalization, disclosure).
├── utils/        → Utility functions (cn, mergeRefs).
└── index.ts      → Single public API surface.
```

## Layer Responsibilities

### `tokens/`

Defines every visual variable used in the system. Tokens are the **only** source of truth for color, spacing, typography, border radius, and shadow values.

```ts
// tokens/color.ts
export const color = {
  primary:        'var(--color-primary)',
  primaryFg:      'var(--color-primary-fg)',
  surface:        'var(--color-surface)',
  surfaceHover:   'var(--color-surface-hover)',
  border:         'var(--color-border)',
  textPrimary:    'var(--color-text-primary)',
  textSecondary:  'var(--color-text-secondary)',
  destructive:    'var(--color-destructive)',
} as const;

// tokens/spacing.ts — 4px base grid
export const spacing = {
  1: 'var(--spacing-1)',   // 4px
  2: 'var(--spacing-2)',   // 8px
  3: 'var(--spacing-3)',   // 12px
  4: 'var(--spacing-4)',   // 16px
  6: 'var(--spacing-6)',   // 24px
  8: 'var(--spacing-8)',   // 32px
} as const;

// tokens/typography.ts
export const typography = {
  fontSizeXs:  'var(--font-size-xs)',   // 12px
  fontSizeSm:  'var(--font-size-sm)',   // 14px
  fontSizeMd:  'var(--font-size-md)',   // 16px
  fontSizeLg:  'var(--font-size-lg)',   // 18px
  fontSizeXl:  'var(--font-size-xl)',   // 20px
  fontWeightNormal: 'var(--font-weight-normal)',
  fontWeightMedium: 'var(--font-weight-medium)',
  fontWeightBold:   'var(--font-weight-bold)',
} as const;

// tokens/radius.ts
export const radius = {
  sm:   'var(--radius-sm)',    // 4px
  md:   'var(--radius-md)',    // 8px
  lg:   'var(--radius-lg)',    // 12px
  full: 'var(--radius-full)',  // 9999px
} as const;
```

All CSS custom properties are declared once in `tokens/globals.css` and imported in `apps/web/app/globals.css`.

### `components/`

Stateless, accessible UI building blocks. Each component:
- Is styled exclusively via CVA variant maps that reference token CSS variables
- Accepts a `state` prop typed as `'idle' | 'loading' | 'empty' | 'error'`
- Wraps a Radix UI primitive for accessible behaviour where applicable
- Has no knowledge of routing, business data, or i18n keys

```
Button, Input, Card, Badge, Spinner, Avatar, Toast, EmptyState, ErrorState, Separator, Skeleton
```

### `patterns/`

Layout compositions built from components. Each pattern:
- Accepts content via named slot props (never renders its own content text)
- Owns the structural HTML/CSS layout — pages must not duplicate it
- Forwards the `state` prop to inner components for unified loading/error handling
- Is product-agnostic: named by layout role, not by business feature

### `hooks/`

Shared UI hooks that are consumed by both components and patterns:

```ts
// hooks/useAsyncState.ts — canonical async state normaliser
export function useAsyncState<T>(fetcher: () => Promise<T>) {
  // returns { status: 'idle' | 'loading' | 'empty' | 'error', data, error, refetch }
}

// hooks/useDisclosure.ts — open/close toggle for dialogs, drawers
export function useDisclosure(initial = false) {
  // returns { isOpen, open, close, toggle }
}
```

### `utils/`

```ts
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Dependency Rules (STRICT)

```
tokens      ←  components  ←  patterns
                                  ↑
                               hooks / utils (shared, no upward deps)

tokens      → MUST NOT import from components, patterns, or any app code
components  → MUST import from tokens only (no patterns, no app code)
patterns    → MUST import from components and tokens only (no app code)
hooks/utils → MUST NOT import from components or patterns
```

These rules are enforced by ESLint `import/no-restricted-paths` in `packages/config/eslint/base.js`.

---

# 3. UI Export Layer

## `packages/ui`

`packages/ui` is a **pass-through** package with a single responsibility: re-export everything from `@speckit/design-system` under the `@speckit/ui` namespace.

```ts
// packages/ui/index.ts
export * from '@speckit/design-system';
```

### Why a Separate UI Package

1. **Single controlled entry point**: All `apps/` code imports from `@speckit/ui`. The ESLint rule `no-restricted-imports` blocks direct imports from `@speckit/design-system` in app code. This means the design-system internals can be restructured without updating app import paths.

2. **Versioning gate**: When a breaking change is made to the design-system, the `ui` package version bump is the explicit signal. Apps pin to `@speckit/ui` versions; they are shielded from design-system internal churn.

3. **Future extensibility**: If a second app (e.g. a mobile web variant) needs a subset of the design-system, `packages/ui` can be forked or conditionally re-exported without touching `design-system` itself.

4. **AI constraint enforcement**: Cursor rules and ESLint rules reference `@speckit/ui` as the only allowed UI import in `apps/`. This is a single string to enforce rather than a set of internal sub-paths.

```ts
// ESLint rule in packages/config/eslint/next.js
'no-restricted-imports': ['error', {
  patterns: [
    {
      group: ['@speckit/design-system', '@speckit/design-system/*'],
      message: 'Import from @speckit/ui instead of @speckit/design-system directly.',
    },
  ],
}],
```

---

# 4. Frontend App Structure

## Directory Map

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Route group: unauthenticated pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/        # Route group: authenticated pages
│   │   ├── layout.tsx      # Wraps children in AppLayout pattern
│   │   ├── page.tsx        # Dashboard page
│   │   └── charts/[id]/page.tsx
│   ├── layout.tsx          # Root: providers (QueryClient, i18n, Zustand)
│   └── globals.css         # @import '@speckit/design-system/tokens/globals.css'
│
├── features/               # Product features (vertical slices)
│   ├── auth/
│   │   ├── components/     # LoginForm, RegisterForm
│   │   ├── hooks/          # useLogin, useRegister
│   │   └── api/            # authApi.ts (calls /api/v1/auth/*)
│   ├── charts/
│   │   ├── components/     # ChartHistoryList, ChartDisplayPanel, ChartCard
│   │   ├── hooks/          # useCharts, useChart, useSaveChart, useDeleteChart
│   │   └── api/            # chartsApi.ts (calls /api/v1/charts/*)
│   └── ai/
│       ├── components/     # PromptInputPanel, GeneratingIndicator
│       ├── hooks/          # useGenerateChart
│       └── api/            # aiApi.ts (calls /api/v1/ai/generate)
│
├── shared/
│   ├── hooks/
│   │   ├── useAsyncState.ts  # Re-exported from @speckit/ui; app-level alias
│   │   └── useAuth.ts        # Reads auth state from Zustand store
│   ├── lib/
│   │   ├── api-client.ts     # Base fetch/axios instance with auth header injection
│   │   └── query-client.ts   # TanStack Query client (staleTime, retry config)
│   └── store/
│       └── index.ts          # Zustand: { user, activeChart, setUser, setActiveChart }
│
├── locales/
│   ├── en.json
│   └── zh.json
│
└── public/
    └── favicon.ico
```

## UI Usage Rules

| Rule | Mechanism |
|------|-----------|
| `features/` and `app/` MUST import UI from `@speckit/ui` | ESLint `no-restricted-imports` |
| MUST NOT import from `@speckit/design-system` directly | ESLint `no-restricted-imports` |
| MUST NOT define `style={{}}` inline props | ESLint `no-restricted-syntax` |
| MUST NOT create component files under `features/**/components/` that define layout | ESLint custom rule (no structural JSX outside design-system) |
| MUST use a pattern from `@speckit/ui` for all page-level layout | Cursor rule + code review gate |
| MUST use `useAsyncState` for all async data | Cursor rule + ESLint no-restricted-syntax (blocks raw useEffect+useState async) |
| MUST use `useTranslations()` for all user-visible strings | i18n lint rule |

## Page Composition Pattern

```tsx
// apps/web/app/(dashboard)/page.tsx
import { AppLayout, SplitLayout } from '@speckit/ui';
import { ChartHistoryList }  from '@/features/charts/components/ChartHistoryList';
import { ChartDisplayPanel } from '@/features/charts/components/ChartDisplayPanel';
import { PromptInputPanel }  from '@/features/ai/components/PromptInputPanel';

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

Pages contain: route composition, pattern selection, feature component slots.
Pages do NOT contain: layout markup, styling, data fetching logic (delegated to feature hooks), string literals.

---

# 5. Backend App Structure

## Directory Map

```
apps/api/src/
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts     # POST /auth/register, /login, /refresh
│   │   ├── auth.service.ts        # JWT issue/refresh, bcrypt compare
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts    # Validates Authorization: Bearer <token>
│   │   │   └── local.strategy.ts  # Validates email+password
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts  # Applied globally; bypassed by @Public()
│   │   └── dto/
│   │       ├── register.dto.ts    # class-validator decorators
│   │       └── login.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts    # GET /users/me, PATCH /users/me
│   │   ├── users.service.ts       # Profile read/update via Prisma
│   │   └── dto/
│   │       └── update-user.dto.ts
│   │
│   ├── charts/
│   │   ├── charts.module.ts
│   │   ├── charts.controller.ts   # GET/POST /charts, GET/DELETE /charts/:id
│   │   ├── charts.service.ts      # CRUD via Prisma, scoped to req.user.id
│   │   └── dto/
│   │       ├── create-chart.dto.ts
│   │       └── chart-response.dto.ts
│   │
│   └── ai/
│       ├── ai.module.ts
│       ├── ai.controller.ts       # POST /ai/generate
│       ├── ai.service.ts          # Orchestrates prompt build → LLM call → parse
│       ├── prompt-builder.ts      # Constructs system + user prompt strings
│       ├── response-parser.ts     # Zod validation of LLM JSON output
│       └── schemas/
│           └── chart-output.schema.ts   # Zod schema: chartType, config, name
│
├── common/
│   ├── decorators/
│   │   └── public.decorator.ts    # @Public() marks a route as unauthenticated
│   ├── filters/
│   │   └── http-exception.filter.ts  # Maps all exceptions to { success, data, error }
│   ├── interceptors/
│   │   └── response.interceptor.ts   # Wraps success responses in { success, data, error: null }
│   └── pipes/
│       └── validation.pipe.ts     # Global ValidationPipe (whitelist, forbidNonWhitelisted)
│
├── prisma/
│   ├── prisma.module.ts           # Global PrismaModule
│   └── prisma.service.ts          # PrismaClient with onModuleInit/Destroy lifecycle
│
└── app.module.ts                  # Registers all modules; applies global guard + filter
```

## Module Responsibilities

| Module    | Controller routes                                    | Service responsibilities                              |
|-----------|------------------------------------------------------|-------------------------------------------------------|
| `auth`    | `/auth/register`, `/auth/login`, `/auth/refresh`     | Password hashing, JWT sign/verify, Redis refresh store |
| `users`   | `/users/me` (GET, PATCH)                             | Prisma user read/update                               |
| `charts`  | `/charts` (GET, POST), `/charts/:id` (GET, DELETE)   | Prisma chart CRUD, userId scoping                     |
| `ai`      | `/ai/generate` (POST)                                | Prompt build, OpenAI call, Zod parse, Redis cache     |

---

# 6. Config Setup

## Tailwind Config

```
packages/config/tailwind/base.ts   ← shared preset (tokens as CSS var references)
apps/web/tailwind.config.ts        ← extends preset, adds app-specific content paths
```

```ts
// packages/config/tailwind/base.ts
import type { Config } from 'tailwindcss';

export const tailwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary:     'var(--color-primary)',
        'primary-fg': 'var(--color-primary-fg)',
        surface:     'var(--color-surface)',
        border:      'var(--color-border)',
        destructive: 'var(--color-destructive)',
      },
      spacing: {
        // extends with token aliases if needed
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
      },
      fontSize: {
        xs:  ['var(--font-size-xs)', { lineHeight: '1rem' }],
        sm:  ['var(--font-size-sm)', { lineHeight: '1.25rem' }],
        md:  ['var(--font-size-md)', { lineHeight: '1.5rem' }],
        lg:  ['var(--font-size-lg)', { lineHeight: '1.75rem' }],
      },
    },
  },
};
```

```ts
// apps/web/tailwind.config.ts
import { tailwindPreset } from '@speckit/config/tailwind/base';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [tailwindPreset as Config],
  content: [
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    '../../packages/design-system/**/*.{ts,tsx}',
  ],
};
export default config;
```

## TypeScript Config

```
packages/config/tsconfig/base.json        ← strict mode, decorators, path aliases
packages/config/tsconfig/nextjs.json      ← extends base, adds Next.js JSX settings
packages/config/tsconfig/nestjs.json      ← extends base, adds emitDecoratorMetadata
apps/web/tsconfig.json                    ← extends nextjs.json, adds @/ path alias
apps/api/tsconfig.json                    ← extends nestjs.json, adds @/ path alias
```

```jsonc
// packages/config/tsconfig/base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

```jsonc
// apps/web/tsconfig.json
{
  "extends": "@speckit/config/tsconfig/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@speckit/ui": ["../../packages/ui/index.ts"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

## ESLint Config

```
packages/config/eslint/base.js       ← Core rules (no-console, import order)
packages/config/eslint/next.js       ← UI governance rules (critical)
packages/config/eslint/nest.js       ← NestJS-specific (no unused decorators)
apps/web/.eslintrc.js                ← extends next.js preset
apps/api/.eslintrc.js                ← extends nest.js preset
```

```js
// packages/config/eslint/next.js  — UI governance rules
module.exports = {
  rules: {
    // Block inline style props in app code
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[name.name="style"]',
        message: 'Inline style props are forbidden. Use design-system tokens via @speckit/ui.',
      },
    ],

    // Block direct design-system imports in app code
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@speckit/design-system', '@speckit/design-system/*'],
            message: 'Import from @speckit/ui, not @speckit/design-system directly.',
          },
        ],
      },
    ],

    // Block hardcoded color/spacing values outside design-system
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^#[0-9a-fA-F]{3,6}$/]',
        message: 'Hardcoded hex color values are forbidden. Use token CSS variables.',
      },
    ],
  },
};
```

---

# 7. Environment Design

## Structure

```
# Root-level template (committed)
.env.example

# App-level env files (git-ignored)
apps/web/.env.local          # Next.js (NEXT_PUBLIC_* for client-safe values)
apps/api/.env                # NestJS (server-only secrets)
apps/api/.env.example        # Committed template
```

## `apps/api/.env.example`

```bash
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/speckit_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=change-me-in-production
JWT_ACCESS_TTL=900          # 15 minutes in seconds
JWT_REFRESH_TTL=604800      # 7 days in seconds

# AI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_TIMEOUT_MS=30000
```

## `apps/web/.env.example`

```bash
# Public (safe to expose to browser)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Server-only (not prefixed with NEXT_PUBLIC_)
# (none in v1 — all secrets live in apps/api)
```

## Dev vs Prod Separation

| Concern | Dev | Prod |
|---------|-----|------|
| Database URL | Docker Compose local instance | Managed PostgreSQL (RDS / Supabase) |
| Redis URL | Docker Compose local instance | Managed Redis (ElastiCache / Upstash) |
| OpenAI key | Developer's own key in `.env` | CI secret injected at deploy time |
| JWT secret | Any value | Randomly generated 256-bit secret |
| API URL | `http://localhost:3001` | `https://api.speckit.app` |

---

# 8. Dependency Rules

```
apps/web (features, app)
    ↓ imports from
@speckit/ui
    ↓ re-exports from
@speckit/design-system
    ↓ depends on
(Radix UI, CVA, Tailwind CSS, clsx, tailwind-merge — external only)

apps/api
    ↓ imports from
@speckit/config          (tsconfig, eslint only — no runtime dependency)
(NestJS, Prisma, OpenAI SDK, Zod, class-validator — external only)

@speckit/design-system   → MUST NOT import from apps/*, @speckit/ui, or any business code
@speckit/ui              → MUST NOT import from apps/* or any business code
@speckit/config          → MUST NOT import from apps/*, design-system, or ui
```

## Allowed Import Graph

```
┌──────────────────────────────────────────────────────┐
│  apps/web (features, app router pages)               │
│    ↓ only allowed import for UI                      │
├──────────────────────────────────────────────────────┤
│  @speckit/ui  (packages/ui)                          │
│    ↓ re-exports                                      │
├──────────────────────────────────────────────────────┤
│  @speckit/design-system  (packages/design-system)    │
│    ├── tokens     (no internal deps)                 │
│    ├── utils      (no internal deps)                 │
│    ├── hooks      (no internal deps)                 │
│    ├── components (→ tokens, utils, hooks)           │
│    └── patterns   (→ components, tokens)             │
└──────────────────────────────────────────────────────┘

apps/api → NO dependency on any packages/* UI code (enforced by ESLint)
```

Turborepo `turbo.json` encodes this as a dependency graph so the build pipeline runs layers in the correct order and caches each layer independently.

---

# 9. UI Governance Integration

## 9.1 Design System Enforcement

**Central UI layer via `@speckit/ui`**

Every component, pattern, token, and hook used in `apps/` must come from `@speckit/ui`. This is enforced at three levels:
1. **ESLint** (`no-restricted-imports`): any import from `@speckit/design-system` or local component paths fails CI
2. **Turborepo dependency graph**: `apps/web` lists `@speckit/ui` as a workspace dependency; `@speckit/design-system` is not in its `package.json` — the module resolver cannot find it even without the ESLint rule
3. **Cursor rules** (`.cursor/rules/`): AI-generated code is instructed to import from `@speckit/ui` exclusively

**No direct styling**

`style={{}}` props and raw hex/px values in JSX are lint errors. Tailwind utility classes outside the design-system package must reference token-mapped values (via the `tailwindPreset`), not arbitrary values.

## 9.2 Pattern Usage

**Layout abstraction is ready by structure**

The `patterns/` directory in `packages/design-system` contains all named layout compositions defined in the architecture spec. Because pages must compose from `@speckit/ui`, and `@speckit/ui` exports all patterns, there is no route to building a page layout that doesn't use a pattern — the structural options are exactly what is in the package.

**Slot-based API forces structural discipline**

Patterns accept `children` and named slot props (e.g. `sidebar`, `header`, `footer`). A page author cannot inject layout markup into a pattern — they can only inject content into defined slots. This prevents the most common form of layout sprawl.

## 9.3 AI Constraints

**Structure prevents free-style UI generation**

When an AI tool (Cursor or otherwise) generates a page or feature component, the following structural facts constrain the output:

1. `package.json` in `apps/web` only lists `@speckit/ui` as a UI dependency — there is no other UI package to import
2. ESLint rules in the CI pipeline catch and reject any violation before merge
3. Cursor rules files (`.cursor/rules/`) document the import constraint, the pattern requirement, the i18n requirement, and the `useAsyncState` requirement as explicit instructions
4. The `app/` directory structure (route groups, layout files) signals to AI which file is a page and which is a feature component — the structural role is clear from the path

These constraints mean AI code generation errors are caught at the lint/typecheck stage, not at code review, and often corrected automatically by the AI upon seeing the ESLint output.

---

# 10. Extensibility

## Adding a New Component

1. Create `packages/design-system/components/ComponentName/`
2. Add `ComponentName.tsx` (Radix primitive + CVA variants + token references)
3. Add `ComponentName.test.tsx` (render + variant tests)
4. Export from `packages/design-system/components/index.ts`
5. Verify it is re-exported from `packages/design-system/index.ts`
6. `@speckit/ui` automatically re-exports it — no change needed in `packages/ui`
7. Use in `apps/web` via `import { ComponentName } from '@speckit/ui'`

**Rule**: No component may be added to any `apps/` directory. If a feature needs a new visual element, it must be added to the design-system first.

## Adding a New Pattern

1. Create `packages/design-system/patterns/PatternName/`
2. Define slot props interface + layout implementation using existing components
3. Add `state` prop support (`loading`, `empty`, `error`) using `Spinner`/`EmptyState`/`ErrorState`
4. Export from `packages/design-system/patterns/index.ts`
5. Document the slot API in the design-system README
6. Add to the Cursor rules pattern catalogue so AI tools know it exists

**Rule**: Patterns are named by layout role, not by product feature. `ChartWorkspaceLayout` is not a valid pattern name; `SplitLayout` is.

## Evolving Tokens

1. Edit the CSS custom property in `tokens/globals.css`
2. Update the corresponding TypeScript constant in the relevant `tokens/*.ts` file
3. Run `pnpm --filter @speckit/design-system build` to verify no component breaks
4. Run `pnpm turbo lint typecheck` across the repo to catch any downstream breakage

**Rule**: Tokens MUST NOT be overridden at the page or feature level. If a variant requires a different visual value, it is added as a new token (e.g. `--color-chart-axis`) or as a new CVA variant on the component, not as an inline override.

**Rule**: Removing a token is a breaking change and requires a version bump on `@speckit/design-system` and a migration note.
