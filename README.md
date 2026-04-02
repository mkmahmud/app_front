# Buddy Script — Next.js

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
