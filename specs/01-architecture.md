# Charts Generator — Architecture Spec

---

# 1. System Architecture

## 1.1 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client (Browser)                        │
│                    Next.js App (React + TypeScript)              │
│          ┌──────────────────────────────────────────┐           │
│          │          Design System (shared/ui)        │           │
│          │  Tokens → Components → Patterns → Pages   │           │
│          └──────────────────────────────────────────┘           │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS / REST
┌─────────────────────────▼───────────────────────────────────────┐
│                      API Gateway (NestJS)                        │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│   │  Auth Module │  │ Chart Module │  │  AI Proxy Module     │  │
│   └──────────────┘  └──────────────┘  └──────────────────────┘  │
└──────────┬──────────────────┬──────────────────┬────────────────┘
           │                  │                  │
    ┌──────▼──────┐   ┌───────▼──────┐  ┌────────▼────────┐
    │  PostgreSQL  │   │    Redis     │  │  LLM Provider   │
    │  (primary)   │   │  (cache/job) │  │ (OpenAI / other)│
    └─────────────┘   └──────────────┘  └─────────────────┘
```

## 1.2 Frontend / Backend Split

| Concern          | Owner              |
|------------------|--------------------|
| UI rendering     | Next.js (SSR/CSR)  |
| Auth session     | NestJS + JWT       |
| Chart data       | NestJS REST API    |
| AI inference     | NestJS AI Proxy    |
| Persistence      | PostgreSQL         |
| Session cache    | Redis              |

## 1.3 Service Boundaries

- **Frontend** — rendering, i18n, state management, chart display (Recharts/ECharts)
- **API Gateway (NestJS)** — auth, chart CRUD, AI orchestration, request validation
- **LLM Provider** — external AI service, accessed only through the AI Proxy Module
- **PostgreSQL** — user accounts, chart metadata, chart data payloads
- **Redis** — JWT refresh token store, API response caching, rate limiting

## 1.4 System Modules

| Module        | Responsibility                                           |
|---------------|----------------------------------------------------------|
| `auth`        | Registration, login, JWT issue/refresh, password hashing |
| `users`       | User profile management                                  |
| `charts`      | Chart CRUD, list, save, delete                           |
| `ai`          | Prompt intake, LLM call, data extraction, chart config   |
| `export`      | Server-side image export (optional, via canvas rendering)|

---

# 2. Frontend Architecture

## 2.1 UI Architecture Model

The frontend follows a strict **4-layer UI model**. Each layer has a defined responsibility and must not bleed into adjacent layers.

```
┌──────────────────────────────────────┐
│           Page Layer                 │  Business logic, routing, data fetching
├──────────────────────────────────────┤
│           Pattern Layer              │  Reusable layout compositions
├──────────────────────────────────────┤
│           Component Layer            │  Reusable, stateless UI atoms/molecules
├──────────────────────────────────────┤
│           Token Layer                │  Color, spacing, typography, radius, shadow
└──────────────────────────────────────┘
```

### Token Layer
- Design primitives only (no semantic meaning)
- Defined as CSS custom properties and TypeScript constants
- Consumed by the component layer exclusively
- No page or pattern code may reference tokens directly

### Component Layer
- Stateless, reusable UI atoms and molecules: `Button`, `Input`, `Card`, `Badge`, `Spinner`, `Avatar`, `Toast`
- Styled exclusively via tokens
- Expose loading / empty / error states via props
- No business logic, no API calls, no i18n keys resolved here

### Pattern Layer
- Abstract, product-agnostic layout compositions
- Composed from components only
- Named by layout role, not by product feature (e.g. `AppLayout`, not `ChartPageLayout`)
- Patterns accept children via slots/props; they own structure, not content

### Page Layer
- One file per route
- Composes patterns + components
- Owns data fetching (React Query / SWR), business state, and i18n key resolution
- MUST NOT define styles; MUST NOT create inline JSX structures not backed by a component or pattern

---

## 2.2 Design System Strategy

### Location

```
packages/
  design-system/
    tokens/          # color, spacing, typography, radius, shadow
    components/      # Button, Input, Card, Spinner, Badge, ...
    patterns/        # AppLayout, SplitLayout, FormPattern, TablePattern, ...
    index.ts         # public API surface
```

### Consumption

All apps import exclusively from `@speckit/design-system`:

```ts
import { Button, AppLayout, tokens } from '@speckit/design-system';
```

The design system is a local workspace package (Turborepo / pnpm workspace).

### Extensibility Rules

1. New visual elements MUST be added to `design-system` before use in any page
2. Tokens may be extended but MUST NOT be overridden at the page level
3. Components accept a `variant` prop for intentional variations; ad-hoc className overrides are forbidden
4. Breaking changes to the public API require a version bump and migration note

---

## 2.3 UI Control Boundaries (CRITICAL)

| Rule                                          | Enforcement                          |
|-----------------------------------------------|--------------------------------------|
| Business code MUST NOT define styles          | ESLint rule: no inline `style` prop  |
| UI must only come from design-system          | ESLint rule: no local component files outside `design-system` |
| New UI must be added to design-system first   | PR checklist + code review gate      |
| No Tailwind / CSS Modules in pages            | Cursor rule enforced                 |
| No hardcoded color / spacing values           | Token lint rule                      |

---

## 2.4 Pattern Strategy

Patterns solve the problem of repeated layout structure being recreated inconsistently across pages.

### Defined Patterns

| Pattern        | Description                                              |
|----------------|----------------------------------------------------------|
| `AppLayout`    | Top nav bar + collapsible left sidebar + main content area |
| `SplitLayout`  | Vertical or horizontal two-panel split with configurable ratio |
| `FormPattern`  | Labeled fields, validation messages, submit/cancel actions |
| `TablePattern` | Header, rows, empty state, loading skeleton, pagination  |
| `PanelPattern` | Scrollable panel with header, body, and footer slot      |

### Why Patterns Are Required

Without patterns, each page reinvents layout HTML, causing visual and structural inconsistency, making global layout changes expensive, and making AI-generated pages unreliable.

### How Pages Compose Patterns

```tsx
// pages/dashboard.tsx
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

Pages pass content into pattern slots. Patterns own the layout structure.

---

## 2.5 UI State Model

All components and patterns MUST support three standard states:

| State     | Trigger                                  | Rendering                              |
|-----------|------------------------------------------|----------------------------------------|
| `loading` | Data is being fetched                    | Skeleton or `Spinner` component        |
| `empty`   | Fetch succeeded, no data                 | `EmptyState` component with message    |
| `error`   | Fetch failed                             | `ErrorState` component with retry CTA  |

### Standardization

- A `useAsyncState<T>` hook normalizes all async calls to `{ status, data, error }`
- Components accept a `state` prop typed as `'idle' | 'loading' | 'empty' | 'error'`
- Patterns render the appropriate child state automatically when `state` is passed

---

## 2.6 AI UI Generation Constraints (CRITICAL)

When AI (Cursor or other LLM) generates frontend code, it MUST adhere to:

| Constraint                                     | Why                                      |
|------------------------------------------------|------------------------------------------|
| MUST import from `@speckit/design-system` only | Ensures visual consistency               |
| MUST use a Pattern for any page-level layout   | Prevents ad-hoc layout sprawl            |
| MUST NOT write `style={{...}}` inline styles   | Bypasses the token system                |
| MUST NOT write CSS files outside design-system | Breaks single source of truth            |
| MUST NOT invent layout structures              | Patterns cover all layout needs          |
| MUST use i18n keys, never string literals      | Enforces i18n readiness                  |
| MUST use `useAsyncState` for data fetching     | Ensures consistent loading/empty/error   |

---

# 3. Backend Architecture

## 3.1 API Style

**REST** — JSON over HTTPS. Simple, well-understood by the team, good tooling.

## 3.2 Service Modules

| Module   | Responsibilities                                                        |
|----------|-------------------------------------------------------------------------|
| `auth`   | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`         |
| `users`  | `GET /users/me`, `PATCH /users/me`                                      |
| `charts` | `GET /charts`, `POST /charts`, `GET /charts/:id`, `DELETE /charts/:id` |
| `ai`     | `POST /ai/generate` — receives prompt, returns chart config + data      |

## 3.3 Authentication Strategy

- Email + password registration (bcrypt hashing)
- JWT access token (15 min TTL) + refresh token (7 days, stored in Redis)
- `Authorization: Bearer <token>` header on all protected routes
- NestJS `AuthGuard` applied globally; public routes marked with `@Public()` decorator

## 3.4 AI Service Integration

- AI Proxy Module calls the LLM provider (OpenAI-compatible API)
- API key stored in environment variable, never exposed to frontend
- Prompt construction and data extraction logic lives exclusively in this module
- Timeout and retry handled at the module level

---

# 4. Data Storage Design

## 4.1 Database Choice

**PostgreSQL** — relational, ACID-compliant, supports JSONB for chart payload storage.

ORM: **Prisma** (TypeScript-native, migration tooling, type-safe queries)

## 4.2 Schema Design (High Level)

### `users`

| Column         | Type         | Notes                        |
|----------------|--------------|------------------------------|
| `id`           | UUID (PK)    |                              |
| `email`        | VARCHAR(255) | unique, not null             |
| `username`     | VARCHAR(100) | unique, not null             |
| `passwordHash` | VARCHAR(255) | bcrypt hash                  |
| `createdAt`    | TIMESTAMP    |                              |
| `updatedAt`    | TIMESTAMP    |                              |

### `charts`

| Column      | Type         | Notes                                     |
|-------------|--------------|-------------------------------------------|
| `id`        | UUID (PK)    |                                           |
| `userId`    | UUID (FK)    | references `users.id`, cascade delete     |
| `name`      | VARCHAR(255) | AI-generated or user-defined title        |
| `chartType` | VARCHAR(50)  | e.g. `bar`, `line`, `pie`, `scatter`      |
| `prompt`    | TEXT         | original user prompt                      |
| `config`    | JSONB        | full chart config (axes, series, options) |
| `createdAt` | TIMESTAMP    |                                           |
| `updatedAt` | TIMESTAMP    |                                           |

## 4.3 Chart Data Storage

Chart data is embedded in the `config` JSONB column alongside rendering options. This keeps chart fetch to a single row query with no joins.

## 4.4 User Data Storage

User credentials in `users` table. Refresh tokens stored in Redis with key `refresh:<userId>` and TTL matching token expiry.

---

# 5. API Design

## 5.1 API Style

RESTful JSON API. Base path: `/api/v1`. All responses follow a uniform envelope:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Errors:

```json
{
  "success": false,
  "data": null,
  "error": { "code": "INVALID_CREDENTIALS", "message": "..." }
}
```

## 5.2 Major Endpoints

| Method | Path                  | Auth | Description                          |
|--------|-----------------------|------|--------------------------------------|
| POST   | `/auth/register`      | No   | Register with email + password       |
| POST   | `/auth/login`         | No   | Login, returns access + refresh JWT  |
| POST   | `/auth/refresh`       | No   | Exchange refresh token for new access|
| GET    | `/users/me`           | Yes  | Get current user profile             |
| GET    | `/charts`             | Yes  | List user's saved charts             |
| POST   | `/charts`             | Yes  | Save a chart                         |
| GET    | `/charts/:id`         | Yes  | Get a single chart                   |
| DELETE | `/charts/:id`         | Yes  | Delete a chart                       |
| POST   | `/ai/generate`        | Yes  | Submit prompt, receive chart config  |

## 5.3 Request / Response Pattern

### `POST /ai/generate`

Request:
```json
{ "prompt": "帮我比较今年1-6月北京和上海的销售额..." }
```

Response:
```json
{
  "success": true,
  "data": {
    "name": "北京 vs 上海月度销售额对比",
    "chartType": "bar",
    "config": {
      "xAxis": { "data": ["1月","2月","3月","4月","5月","6月"] },
      "series": [
        { "name": "北京", "data": [120,130,150,170,180,200] },
        { "name": "上海", "data": [100,140,160,150,190,210] }
      ]
    }
  }
}
```

---

# 6. Data Flow

```
User types prompt
      │
      ▼
Frontend validates non-empty input
      │
      ▼
POST /ai/generate  (prompt text)
      │
      ▼
AI Module builds system prompt + user prompt
      │
      ▼
LLM Provider (OpenAI) → structured JSON response
      │
      ▼
AI Module parses: extract data, select chart type, build chart config
      │
      ▼
Response returned to frontend
      │
      ▼
Frontend renders chart (ECharts / Recharts)
      │
      ├─→ User clicks "Save" → POST /charts (saves config to PostgreSQL)
      │
      └─→ User clicks "Export" → canvas.toBlob() → download PNG
```

---

# 7. AI Integration

## 7.1 LLM Usage

- Provider: OpenAI (GPT-4o or equivalent), swappable via env config
- Called from the `AiModule` in NestJS only — never called client-side

## 7.2 Prompt Processing

The system prompt instructs the LLM to:
1. Extract all numerical data series and labels from the user message
2. Select the most appropriate chart type (bar, line, pie, scatter, radar) based on data shape and user intent
3. If the user explicitly names a chart type, use that type
4. Return a strict JSON structure (function calling / structured output mode)

## 7.3 Data Extraction Logic

LLM output is validated against a Zod schema before use. If validation fails, the API returns a structured error asking the user to rephrase. No raw LLM strings are passed to the frontend.

## 7.4 Chart Type Decision Logic

| Data Pattern                          | Default Chart Type |
|---------------------------------------|--------------------|
| Comparison across categories          | `bar`              |
| Trend over time                       | `line`             |
| Part-to-whole proportion              | `pie`              |
| Correlation between two variables     | `scatter`          |
| Multi-dimension performance           | `radar`            |
| User explicitly specifies type        | User-specified     |

---

# 8. Scalability Strategy

## 8.1 Target Load

| Metric               | Target      |
|----------------------|-------------|
| Registered users     | 100,000     |
| Daily active users   | 5,000       |
| Concurrent users     | 1,000       |

## 8.2 Handling Load

- NestJS API is **stateless** — horizontal scaling behind a load balancer (e.g. AWS ALB / Nginx)
- PostgreSQL with connection pooling (PgBouncer or Prisma connection pool)
- Redis for refresh token store and response caching on repeated identical prompts

## 8.3 Caching Strategy

| Cache Target              | TTL    | Store     |
|---------------------------|--------|-----------|
| Duplicate AI prompt result| 5 min  | Redis     |
| Chart list per user       | 30 sec | Redis     |
| JWT refresh tokens        | 7 days | Redis     |

## 8.4 Async Processing

AI generation (`POST /ai/generate`) is synchronous in v1 due to LLM response times being acceptable (<10 seconds). If P99 latency exceeds tolerance, introduce a job queue (BullMQ + Redis) with SSE or WebSocket for result delivery in v2.

---

# 9. Dev & Governance

## 9.1 Code Generation Rules

- All generated code MUST follow `specs/` and `.cursor/rules/` definitions
- No ad-hoc code outside defined module boundaries
- Prisma migrations MUST be generated and committed alongside schema changes (per `rules/21-backend-persistence.mdc`)

## 9.2 UI Governance

| Check                              | Mechanism                                |
|------------------------------------|------------------------------------------|
| No inline styles in pages          | ESLint `no-restricted-syntax` rule       |
| Imports only from design-system    | ESLint `no-restricted-imports`           |
| No hardcoded UI strings            | i18n lint rule                           |
| All states handled                 | PR checklist item                        |
| Pattern used for all page layouts  | Code review gate                         |

## 9.3 CI/CD Pipeline

```
Push → GitHub Actions
  ├── lint (ESLint + Prettier)
  ├── typecheck (tsc --noEmit)
  ├── test (Jest unit + integration)
  ├── build (Next.js + NestJS)
  └── deploy (staging on PR merge to main, prod on release tag)
```

## 9.4 Extensibility

- New chart types: add to the chart-type decision table in `AiModule` + register renderer in frontend chart component
- New UI patterns: add to `packages/design-system/patterns/`, export from index, document in design-system README
- New languages: add locale file to `locales/`, register in i18n config — no code changes required elsewhere
- New API modules: scaffold with NestJS CLI, register in `AppModule`, add OpenAPI annotations
