# SaaS Boilerplate — Next.js 14 Production Starter

A production-ready, scalable SaaS frontend starter built with **Next.js 14 App Router**, **TypeScript**, **shadcn/ui**, **Redux Toolkit**, and **React Query**. Designed for real-world SaaS products with security, performance, and developer experience as first-class concerns.

---

##   Features

| Category | Details |
|---|---|
| 🏗 Architecture | Feature-based modular structure, Separation of Concerns |
| 🎨 Design System | shadcn/ui + Tailwind CSS, dark mode, design tokens |
| ⚡ Performance | Server Components, dynamic imports, ISR, code splitting |
| 🔐 Security | Middleware auth guards, HTTP-only cookies, RBAC, XSS protection |
| 🌐 API Layer | Axios with interceptors, refresh token flow, cancellation |
| 🧠 State | React Query (server) + Redux Toolkit (UI) + useState (local) |
| 🧪 Testing | Jest + React Testing Library + Playwright E2E |
| 📊 Observability | Sentry error tracking, PostHog / GA analytics |
| ♿ Accessibility | Semantic HTML, ARIA labels, keyboard navigation |
| 🌍 i18n | next-intl structure ready |
| ⚙️ Feature Flags | Env-driven feature toggles |
| 📱 Mobile-First | Responsive, touch-optimized |

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── auth/                   # Auth pages (login, register, forgot-password)
│   ├── dashboard/              # Protected dashboard pages
│   ├── api/auth/               # API route handlers (token refresh)
│   ├── not-found.tsx           # 404 page
│   ├── unauthorized/           # 403 page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles + CSS variables
│
├── features/                   # Feature-based modules
│   ├── auth/
│   │   ├── components/         # LoginForm, RegisterForm, ForgotPasswordForm
│   │   ├── hooks/              # useAuth
│   │   ├── services/           # auth.service.ts (API calls)
│   │   ├── slice/              # auth.slice.ts (Redux)
│   │   └── types/              # Auth-specific types
│   ├── dashboard/
│   │   ├── components/         # StatCard, DashboardContent
│   │   ├── hooks/              # useDashboardStats, useUsers, etc.
│   │   ├── services/           # dashboard.service.ts
│   │   └── slice/              # dashboard.slice.ts
│   └── user/
│       └── ...                 # Same structure
│
├── components/
│   ├── ui/                     # Base components (Button, Input, Badge, Card...)
│   └── shared/                 # App-level shared (Sidebar, Header, ErrorBoundary...)
│
├── hooks/                      # Global reusable hooks
│   └── index.ts                # useDebounce, usePagination, usePermission, etc.
│
├── lib/
│   ├── api.ts                  # Axios client + interceptors + token refresh
│   ├── utils.ts                # cn(), sanitize, format helpers
│   └── logger.ts               # Structured logger + Sentry integration
│
├── store/
│   ├── index.ts                # Redux store configuration
│   └── ui.slice.ts             # Global UI state (sidebar, toasts, modals)
│
├── config/
│   └── constants.ts            # App config, ROUTES, ROLES, PERMISSIONS, FEATURE_FLAGS
│
├── types/
│   └── api.ts                  # Global TypeScript types
│
└── middleware.ts               # Auth protection + RBAC + security headers
```

---

## Getting Started

### Prerequisites

- Node.js 18.17+ 
- npm / yarn / pnpm

### 1. Clone and install

```bash
git clone https://github.com/your-org/saas-boilerplate.git
cd saas-boilerplate
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_SECRET=your-super-secret-key
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/auth/login`.

---

## Testing

```bash
# Unit + component tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires running dev server)
npm run test:e2e
```

---

##  Authentication Flow

```
User → Login Form → authService.login() → Set HTTP-only cookies
     → Redux state updated → Redirect to dashboard

Protected Route → middleware.ts checks JWT cookie
               → Valid: proceed
               → Invalid: redirect to /auth/login?callbackUrl=...
               → Expired: try refresh → fail → redirect to login

401 Response → API interceptor triggers refresh flow
            → Queue concurrent requests
            → On success: retry all queued requests
            → On fail: logout + redirect
```

---

##  Role-Based Access Control (RBAC)

Roles: `superadmin > admin > user > viewer`

### In middleware (route protection)
```ts
// src/middleware.ts
const ROLE_ROUTES: Record<string, string[]> = {
  '/users': ['admin', 'superadmin'],
  '/settings/billing': ['admin', 'superadmin'],
}
```

### In components (UI rendering)
```tsx
import { PermissionGuard } from '@/components/shared/permission-guard'

<PermissionGuard permission="user:delete">
  <DeleteButton />
</PermissionGuard>

<PermissionGuard role={['admin', 'superadmin']} fallback={<p>No access</p>}>
  <AdminPanel />
</PermissionGuard>
```

### In hooks
```ts
const { hasPermission, hasRole } = usePermission()

if (hasPermission('user:create')) {
  // show create button
}
```

---

## 🌐 API Layer

The centralized API client (`src/lib/api.ts`) provides:

- **Token attachment** — auto-injects `Authorization: Bearer <token>` header
- **Request interceptors** — adds `X-Request-ID` for tracing
- **Response interceptors** — normalizes errors into `ApiClientError`
- **Token refresh** — queues requests during refresh, retries after
- **Request cancellation** — via `createCancelToken()`

```ts
import { api } from '@/lib/api'

// Typed responses
const { data } = await api.get<User[]>('/users')
const { data } = await api.post<User>('/users', payload)
const { data } = await api.patch<User>(`/users/${id}`, updates)
await api.delete(`/users/${id}`)
```

---

## 🧠 State Management

| State type | Tool | Example |
|---|---|---|
| Server data | React Query | `useDashboardStats()`, `useUsers()` |
| Global UI | Redux Toolkit | Sidebar, toasts, modals |
| Local component | `useState` | Form state, toggle |
| URL state | `useSearchParams` | Filters, pagination |

### React Query — server state
```ts
// Cache + background refetch + retry built in
const { data, isLoading, isError, refetch } = useDashboardStats()
```

### Redux — UI state
```ts
import { useAppDispatch } from '@/store'
import { addToast, openModal } from '@/store/ui.slice'

dispatch(addToast({ title: 'Saved!', variant: 'success' }))
dispatch(openModal({ id: 'confirm-delete', data: { userId } }))
```

---

## 🪝 Reusable Hooks

```ts
import {
  useDebounce,       // Debounce any value
  usePagination,     // Full pagination state + helpers
  usePermission,     // hasPermission(), hasRole()
  useNetworkStatus,  // isOnline / isOffline
  useLocalStorage,   // Persistent state with SSR safety
  useClickOutside,   // Detect clicks outside a ref
  useMediaQuery,     // Responsive breakpoint detection
  useIsMobile,       // Shorthand for mobile breakpoint
  useFeatureFlag,    // Check feature flags
} from '@/hooks'
```

### Examples

```ts
// Debounced search
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)

// Pagination
const { page, pageSize, nextPage, prevPage, params } = usePagination({ total })
const { data } = useUsers(params)

// Feature flags
const analyticsEnabled = useFeatureFlag('ANALYTICS')
```

---

## ⚙️ Feature Flags

Flags are driven by environment variables:

```env
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_BILLING=false
NEXT_PUBLIC_FEATURE_WEBSOCKET=false
```

Usage:

```ts
import { FEATURE_FLAGS } from '@/config/constants'

if (FEATURE_FLAGS.ANALYTICS) { /* ... */ }

// Or via hook
const isEnabled = useFeatureFlag('BILLING')
```

---

## 🎨 Design System

### Design tokens (CSS variables)

All colors, radius, and typography are CSS variables defined in `globals.css` and referenced in `tailwind.config.ts`. Dark mode is automatic via `next-themes`.

### Spacing grid

Uses a strict 4px/8px grid (`spacing` in `tailwind.config.ts`).

### Adding a new UI component

```tsx
// src/components/ui/my-component.tsx
import { cn } from '@/lib/utils'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined'
}

export function MyComponent({ className, variant = 'default', ...props }: Props) {
  return (
    <div
      className={cn(
        'base-classes',
        variant === 'outlined' && 'border border-border',
        className
      )}
      {...props}
    />
  )
}
```

---

## 🏗 Adding a New Feature

Each feature lives in `src/features/<name>/` and follows this structure:

```
features/
└── billing/
    ├── components/
    │   ├── billing-overview.tsx
    │   └── invoice-table.tsx
    ├── hooks/
    │   └── useBilling.ts          # React Query hooks
    ├── services/
    │   └── billing.service.ts     # API calls
    ├── slice/
    │   └── billing.slice.ts       # Redux slice (if needed)
    └── types/
        └── billing.types.ts
```

### Steps

1. Create the folder structure above
2. Add your service (`api.get/post/...`)
3. Create React Query hooks in `hooks/`
4. Build components that consume the hooks
5. Register Redux slice in `src/store/index.ts` (if needed)
6. Add routes in `src/app/` and nav items in `sidebar.tsx`
7. Add permissions in `src/config/constants.ts`

---

## 📦 Bundle Analysis

```bash
npm run analyze
```

Opens a visual bundle analyzer showing what's contributing to bundle size.

---

## 🚢 Deployment

### Vercel (recommended)
```bash
npx vercel --prod
```

Set all `.env.example` variables in your Vercel project settings.

### Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📋 Code Conventions

- **File naming**: `kebab-case.tsx` for components, `camelCase.ts` for utils/hooks
- **Component naming**: PascalCase exports
- **Imports**: Use `@/` alias — no relative `../../` imports
- **Types**: Co-locate with feature, share global types in `src/types/`
- **Hooks**: Prefix with `use`, live in feature `hooks/` or global `src/hooks/`
- **Services**: Pure async functions, no side effects, return typed data
- **Slices**: Keep reducers pure, no async logic (use React Query for server state)

---

## 🤝 Contributing

1. Branch from `main`: `git checkout -b feat/my-feature`
2. Run `npm run type-check` and `npm test` before committing
3. Commits are linted via Husky pre-commit hooks
4. Open a pull request with a clear description

---

## 📄 License

MIT
