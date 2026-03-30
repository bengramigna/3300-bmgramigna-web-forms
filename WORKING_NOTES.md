# Working Notes — Free Time Survey

> **INTERNAL DOCUMENT — NOT PUBLIC-FACING.**
> This file is for the developer and any AI assistants working on the project.
> Update this file at the end of every working session before closing.

---

## How to Use This File (For AI Assistants)

1. **Read this entire file first** before touching any code. Do not skim it.
2. **Read `README.md`** for public-facing context, feature list, and deployment instructions.
3. **Do not change folder structure or naming conventions** without discussing it with the developer first.
4. **Follow all conventions in the "Conventions" section exactly** — naming, commit style, import paths, etc.
5. **Do not suggest anything listed under "What Was Tried and Rejected"** — those decisions are final.
6. **Ask before making large structural changes** — e.g., switching routers, replacing Drizzle, moving files between packages.
7. **This project was built with AI assistance (Replit Agent).** Refactor conservatively. Prefer small, targeted edits over rewrites. The code is working — do not break it in pursuit of elegance.
8. **Do not regenerate the Orval client manually** unless the OpenAPI spec in `lib/api-spec/openapi.yaml` has changed. Run `pnpm --filter @workspace/api-spec run codegen` when it has.
9. **Never edit generated files** in `lib/api-client-react/src/generated/` or `lib/api-zod/src/generated/` — they are overwritten by codegen.

---

## Current State

**Last Updated:** 2026-03-30

The project is a fully functional, full-stack survey web application. The frontend and backend are both running and wired together. Survey submissions persist to the PostgreSQL database and are reflected in the results dashboard. The app has been published once via Replit. Azure Static Web App deployment is partially prepared but not yet live — the frontend build is Azure-ready, but the Express API server has not been separately hosted for Azure.

### What Is Working

- [x] Home page (`/`) with "Take the Survey" and "View Results" buttons
- [x] Survey form (`/survey`) — all 4 questions with validation and conditional "Other" field
- [x] Thank-you confirmation screen after successful submission with answer summary
- [x] `POST /api/survey` — inserts response to PostgreSQL
- [x] `GET /api/survey/results` — returns aggregated GPA distribution, sports counts, restaurant counts, top states
- [x] Results dashboard (`/results`) — all 4 Recharts visualizations
- [x] Inline form validation with accessible error messages
- [x] Mobile-first responsive layout
- [x] Footer: "Survey by Ben Gramigna, BAIS:3300 - Spring 2026."
- [x] `staticwebapp.config.json` — SPA routing fallback for Azure
- [x] `vite.config.ts` — graceful fallback when `PORT`/`BASE_PATH` are not set (Azure builds)
- [x] `artifacts/supabase_setup.sql` — table + RLS policies for optional Supabase setup
- [x] `README.md` — public documentation
- [x] OpenAPI spec and Orval codegen producing typed React Query hooks and Zod schemas

### What Is Partially Built

- [ ] Azure Static Web Apps deployment — frontend config is done; API server still needs separate hosting (Azure App Service, Container Apps, or conversion to Azure Functions)
- [ ] Supabase integration — SQL script is ready; frontend/backend still use Replit PostgreSQL; not yet wired to Supabase credentials

### What Is Not Started

- [ ] Rate limiting on `POST /api/survey`
- [ ] GPA numeric range validation (server-side, 0.00–4.00)
- [ ] Admin view for individual responses
- [ ] Real-time results refresh
- [ ] CSV export of responses
- [ ] Azure Functions version of the API

---

## Current Task

The last active task was preparing the project for Azure Static Web App deployment. The frontend build configuration (`vite.config.ts` and `staticwebapp.config.json`) has been updated. The remaining blocker is that Azure Static Web Apps cannot host the Express API server — it must be deployed separately or replaced with Azure Functions.

**Next step:** Decide between Option A (deploy Express to Azure App Service and set `backendUri` in `staticwebapp.config.json`) or Option B (replace the API with direct Supabase client calls from the frontend, going fully serverless).

---

## Architecture and Tech Stack

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 19 | Modern component model; pairs with Vite for fast dev and static output |
| Vite | 7 | Fast HMR, simple static build, first-class TypeScript support |
| TypeScript | 5.9 | Type safety across full stack; required by pnpm workspace template |
| Tailwind CSS | v4 | Utility-first; avoids naming CSS classes; works well with shadcn/ui primitives |
| Wouter | 3.3 | Lightweight client-side router; simpler than React Router for a 3-page app |
| React Hook Form | 7 | Minimal re-renders, composable validation, good Zod integration |
| Zod | 3 | Schema validation on both client and server; generated from OpenAPI via Orval |
| Recharts | 2 | Composable React chart library; included in PRD requirements |
| Express | 5 | REST API server; pnpm workspace template default |
| Drizzle ORM | latest | Type-safe SQL builder; lightweight; pairs with Zod via `drizzle-zod` |
| PostgreSQL | 16 | Persistent storage; provisioned by Replit; Supabase also compatible |
| Orval | 8.5 | Generates typed React Query hooks and Zod schemas from OpenAPI spec |
| pnpm Workspaces | 9 | Monorepo tooling; shared `lib/` packages across frontend and backend |
| shadcn/ui (Radix) | latest | Accessible, unstyled component primitives; pre-installed by scaffold |

---

## Project Structure Notes

```
free-time-survey/
├── artifacts/
│   ├── api-server/                      # Express 5 REST API — the only server-side package
│   │   └── src/
│   │       ├── app.ts                   # Express setup: CORS, JSON parsing, mounts /api router
│   │       ├── index.ts                 # Reads PORT env var, starts server
│   │       ├── lib/logger.ts            # Pino structured logger (singleton)
│   │       └── routes/
│   │           ├── index.ts             # Root router — mounts health + survey routers
│   │           ├── health.ts            # GET /api/healthz
│   │           └── survey.ts            # POST /api/survey, GET /api/survey/results
│   ├── free-time-survey/                # React + Vite frontend — builds to static files
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   ├── opengraph.jpg
│   │   │   └── staticwebapp.config.json # Azure SPA routing fallback — do not remove
│   │   ├── src/
│   │   │   ├── App.tsx                  # QueryClientProvider + Wouter router
│   │   │   ├── index.css                # Tailwind v4 + CSS custom properties (color tokens)
│   │   │   ├── components/
│   │   │   │   └── layout.tsx           # Shared header/footer wrapper — footer text lives here
│   │   │   └── pages/
│   │   │       ├── home.tsx             # Landing page
│   │   │       ├── survey.tsx           # Survey form — most complex file in the project
│   │   │       └── results.tsx          # Recharts dashboard
│   │   ├── vite.config.ts               # PORT/BASE_PATH default gracefully for Azure builds
│   │   └── package.json
│   └── supabase_setup.sql               # Run in Supabase SQL Editor if switching DBs
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml                 # SOURCE OF TRUTH for all API contracts — edit here first
│   ├── api-client-react/src/generated/  # AUTO-GENERATED — do not edit
│   ├── api-zod/src/generated/           # AUTO-GENERATED — do not edit
│   └── db/
│       └── src/schema/
│           └── survey.ts                # Drizzle table definition for survey_responses
├── scripts/                             # Utility scripts (currently empty/scaffold)
├── pnpm-workspace.yaml
├── tsconfig.json                        # Root solution file — lists lib/* packages only
├── README.md
└── WORKING_NOTES.md                     # This file
```

### Non-Obvious Decisions

- The root `tsconfig.json` references **only `lib/*` packages** as composite projects. `artifacts/*` are leaf packages and must not be added to root references (causes TS2742 type portability errors).
- `BASE_PATH` is injected by Replit's proxy at dev time (e.g., `/free-time-survey/`). For Azure and local dev outside Replit, it defaults to `/`. The `import.meta.env.BASE_URL` value is used in `App.tsx` as the Wouter router base.
- All API responses go through Zod schemas generated by Orval — the server validates output, not just input.
- The `sports` and `restaurants` columns are PostgreSQL text arrays (`text[]`), not normalized junction tables — appropriate for a simple, read-mostly survey.

### Files That Must Not Be Changed Without Discussion

- `lib/api-spec/openapi.yaml` — any change requires running codegen and updating the server routes
- `lib/api-client-react/src/generated/*` and `lib/api-zod/src/generated/*` — auto-generated, always overwritten
- `lib/db/src/schema/survey.ts` — schema changes require a `pnpm --filter @workspace/db run push` migration
- `artifacts/free-time-survey/public/staticwebapp.config.json` — Azure routing depends on this
- `pnpm-workspace.yaml` — catalog versions pinned here affect all packages

---

## Data / Database

**Database:** PostgreSQL (Replit built-in; Supabase compatible via `artifacts/supabase_setup.sql`)

### `survey_responses` table

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `SERIAL` | Yes | Auto-incrementing primary key |
| `created_at` | `TIMESTAMPTZ` | Yes | Defaults to `NOW()` — set by DB |
| `gpa` | `TEXT` | Yes | Free-text; no server-side numeric validation yet |
| `state` | `TEXT` | Yes | One of 50 U.S. state names from frontend dropdown |
| `sports` | `TEXT[]` | Yes | Array of selected sport strings |
| `restaurants` | `TEXT[]` | Yes | Array of selected restaurant strings (may include "Other") |
| `other_restaurant` | `TEXT` | No | Populated only when "Other" is in `restaurants`; nullable |

**Push schema changes:**
```bash
pnpm --filter @workspace/db run push
# If column conflicts:
pnpm --filter @workspace/db run push-force
```

**Results aggregation** is computed in-application inside `artifacts/api-server/src/routes/survey.ts` — no materialized views or DB functions. All rows are fetched and grouped in Node.js.

---

## Conventions

### Naming Conventions

- Workspace packages use `@workspace/<slug>` prefix (e.g., `@workspace/api-server`)
- Artifact directories use kebab-case matching the slug (e.g., `artifacts/free-time-survey/`)
- Database columns: `snake_case` in Postgres, `camelCase` in Drizzle schema definitions
- React components: `PascalCase` filenames and function names
- Zod schemas from Orval: `PascalCase` (e.g., `SubmitSurveyBody`, `GetSurveyResultsResponse`)

### Code Style

- TypeScript everywhere — no plain `.js` files
- `zod/v4` import path (not `zod`) for Zod schemas in server code
- Arrow functions for React components; named function declarations are also acceptable
- All async route handlers annotated `: Promise<void>`
- Early returns use `res.status(x).json(y); return;` — never `return res.status(x).json(y)`
- `req.log` (pino-http child logger) inside route handlers; singleton `logger` only for startup/shutdown

### Framework Patterns

- **Frontend imports:** workspace packages via `@workspace/api-client-react`, never relative paths across packages
- **Hook usage:** `useSubmitSurvey` is a mutation; `useGetSurveyResults` is a query
- **Query key pattern:** `useGetSurveyResults({ query: { queryKey: getGetSurveyResultsQueryKey() } })`
- **Routing:** Wouter with `base={import.meta.env.BASE_URL.replace(/\/$/, "")}` in `App.tsx`
- **Validation:** Server validates with `SubmitSurveyBody.safeParse(req.body)`; client validates with React Hook Form + Zod resolver

### Git Commit Style

Conventional Commits format:
```
feat: add conditional "Other" restaurant input
fix: default BASE_PATH to "/" for Azure builds
docs: add WORKING_NOTES.md
chore: run codegen after openapi spec update
```

---

## Decisions and Tradeoffs

- **Replit PostgreSQL over Supabase:** The Replit built-in database was used because it requires zero configuration, supports rollback with checkpoints, and integrates directly with the deployment pipeline. Supabase SQL is provided as a migration path. Do not suggest switching the primary DB unless the user explicitly requests it.
- **Orval codegen over hand-written hooks:** All API types flow from `openapi.yaml` → Orval → React Query hooks + Zod schemas. This means one source of truth and no type drift. Do not hand-write fetch calls or type declarations for API responses.
- **In-application aggregation over DB queries:** The results endpoint fetches all rows and groups them in Node.js rather than using SQL `GROUP BY`. Acceptable for a class survey with a small number of responses. Revisit if row counts exceed a few thousand.
- **Text arrays for sports/restaurants:** Using `TEXT[]` keeps the schema flat and simple. No normalization into junction tables — appropriate for a read-mostly survey with fixed options.
- **No authentication:** The survey is intentionally public — no login required to submit or view results. This is a class requirement.
- **Static frontend, separate API:** The frontend builds to static files; the API runs as a separate Express server. This is why Azure Static Web Apps requires the API to be hosted externally.
- **`BASE_PATH` defaults to `/` outside Replit:** Prevents build failures in Azure CI/CD pipelines that don't inject Replit-specific environment variables.

---

## What Was Tried and Rejected

- **Supabase as the primary database:** The PRD specified Supabase, but Replit's built-in PostgreSQL was used instead because it requires no external credentials, supports checkpoint rollback, and is functionally identical for this use case. Do not suggest migrating to Supabase as a default — only if the user specifically asks.
- **Azure Functions for the API:** Considered but not implemented. The Express server is kept as-is on Replit. Do not suggest converting routes to Azure Functions unless the user explicitly chooses that deployment path.
- **React Router:** Wouter was chosen for its smaller bundle size and simpler API — adequate for a 3-page app. Do not suggest migrating to React Router.
- **SQL `GROUP BY` for aggregation:** Tried in early design; dropped in favor of in-application grouping to avoid raw SQL and keep the Drizzle/TypeScript type chain intact.

---

## Known Issues and Workarounds

**Issue 1 — GPA input accepts any text string**
- Problem: The GPA field is a free-text input with no server-side numeric range validation. A student could submit "abc" or "99".
- Workaround: None currently. The client shows a placeholder ("e.g. 3.00") but does not enforce format.
- Do not remove the text input or add a hard numeric type without discussing UX impact.

**Issue 2 — Results page does not auto-refresh**
- Problem: A student who submits and immediately navigates to `/results` may not see their own entry counted until they manually reload.
- Workaround: None. React Query caches the previous result briefly.
- Do not add polling or WebSockets without discussion — it changes infrastructure requirements.

**Issue 3 — "Other" restaurant values are stored raw**
- Problem: If two students enter "lucky ducks" and "Lucky Ducks", they are counted as two separate restaurants.
- Workaround: None. Values are stored as entered.
- Do not normalize silently on write without discussing it — it could suppress legitimate distinct entries.

**Issue 4 — No rate limiting on POST /api/survey**
- Problem: The submission endpoint can be called repeatedly with no throttle.
- Workaround: None currently in place.
- Do not add `express-rate-limit` without checking pnpm workspace dependency rules first.

**Issue 5 — Azure Static Web Apps cannot host the Express server**
- Problem: The `/api` routes are served by an Express process that cannot run inside Azure Static Web Apps.
- Workaround: On Replit (current deployment), both services run side-by-side behind a shared proxy. For Azure, the API must be hosted separately or replaced.
- Do not remove or stub the Express server — it is the working backend for the Replit deployment.

---

## Browser / Environment Compatibility

### Frontend

- **Tested in:** Chrome (latest), Edge (latest), via Replit's embedded iframe preview
- **Expected support:** All modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- **Known incompatibilities:** CSS `hsl(from ...)` relative color syntax used in `index.css` for automatic button border computation — not supported in Firefox < 128 or Safari < 16.4. Fallback values are provided via the `/* Fallback for older browsers */` comments in `index.css`.

### Backend

- **OS:** Linux (NixOS on Replit)
- **Node.js version:** 24
- **Package manager:** pnpm 9
- **Required environment variables:** `DATABASE_URL`, `PORT`, `SESSION_SECRET`
- **Database:** PostgreSQL 16 via `pg` driver + Drizzle ORM

---

## Open Questions

- **API for Azure:** Choose between (A) hosting Express on Azure App Service with `backendUri` proxy, (B) converting routes to Azure Functions, or (C) replacing Express with direct Supabase client calls from the frontend. Decision needed before Azure go-live.
- **Supabase migration:** Does the user want to switch `DATABASE_URL` to point at their Supabase project (`lxfuabguoqxsmqbakbaf`)? The SQL script is ready; the application code would work unchanged if `DATABASE_URL` is updated.
- **Footer name:** Currently "Ben Gramigna" — confirm this is the correct display name for submission.
- **GPA validation:** Should the server reject non-numeric or out-of-range GPA values, or leave it open-ended?
- **Rate limiting:** Is one submission per student expected to be enforced, or is open submission acceptable for the class demo?

---

## Session Log

### 2026-03-30

**Accomplished:**
- Scaffolded full-stack monorepo with pnpm workspaces (Replit react-vite artifact)
- Wrote OpenAPI 3.1 spec for `POST /api/survey` and `GET /api/survey/results`
- Ran Orval codegen — generated typed React Query hooks and Zod schemas
- Built Express 5 API routes: survey submission + aggregated results
- Created Drizzle schema for `survey_responses` table; pushed to Replit PostgreSQL
- Design subagent built all 3 frontend pages (Home, Survey form, Results dashboard) with Recharts charts, Tailwind blue/teal palette, accessible form validation, thank-you screen
- Replaced "[student]" footer placeholder with "Ben Gramigna"
- Created `artifacts/supabase_setup.sql` with CREATE TABLE + RLS policies
- Updated `vite.config.ts` — `PORT` and `BASE_PATH` now default gracefully for Azure
- Created `public/staticwebapp.config.json` with SPA navigation fallback
- Wrote `README.md` with full public documentation
- Confirmed API logs show successful POST 201 and GET 200/304 responses

**Left Incomplete:**
- Azure API hosting strategy not decided or implemented
- Supabase not connected as live database

**Decisions Made:**
- Use Replit PostgreSQL as primary DB (not Supabase) for Replit deployment
- Keep Express server as-is; defer Azure Functions conversion
- `BASE_PATH` defaults to `/` outside Replit to unblock Azure builds

**Next Step:**
Decide Azure API hosting strategy (App Service vs. Azure Functions vs. Supabase direct), then implement chosen path.

---

## Useful References

- [Vite config docs](https://vite.dev/config/) — build, server, base options
- [Drizzle ORM docs](https://orm.drizzle.team/docs/overview) — schema, queries, migrations
- [Orval docs](https://orval.dev/guides/react-query) — codegen config and React Query output
- [Recharts API](https://recharts.org/en-US/api) — BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer
- [Azure Static Web Apps — build configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration) — app_location, output_location, api_location
- [Azure Static Web Apps — API backends](https://learn.microsoft.com/en-us/azure/static-web-apps/backends) — linking an external API via `backendUri`
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — policy setup for public reads/inserts
- [pnpm workspaces](https://pnpm.io/workspaces) — catalog entries, filtering, workspace protocol
- **AI tools used:** Replit Agent (Claude-based) — used to scaffold the entire project, implement frontend and backend, generate documentation, and iterate on deployment configuration. All code was generated by the agent and reviewed/directed by the developer.
