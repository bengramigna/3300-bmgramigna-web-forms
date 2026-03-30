# Free Time Survey

## Description

Free Time Survey is a short web-based survey tool built for undergraduate business students at the University of Iowa. It collects background information — high school GPA, home state, sports participation, and favorite Iowa City restaurants — and displays aggregated, anonymized results through interactive charts. The app was created for BAIS:3300 to give students a hands-on look at how survey data is collected and visualized in a real web application.

## Badges

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-14B8A6?style=for-the-badge)

## Features

- **Four-question survey form** covering GPA, home state, high school sports, and favorite Iowa City restaurants
- **Conditional "Other" field** — a text input appears automatically when "Other" is selected in the restaurant question
- **Inline validation** — every required field shows a clear error message on submit without clearing existing answers
- **Thank-you confirmation screen** — summarizes the student's own answers after a successful submission
- **Aggregated results dashboard** — four Recharts visualizations (GPA distribution, sports popularity, restaurant preferences, top states) with no individual responses ever exposed
- **Fully accessible** — all inputs are labeled, errors are text-based, and keyboard navigation works throughout (WCAG 2.1 AA)
- **Mobile-first layout** — single-column on small screens, cards stack vertically with no horizontal scrolling
- **Azure-ready build** — ships with `staticwebapp.config.json` for SPA routing on Azure Static Web Apps

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + Vite 7 | Frontend SPA framework and build tool |
| TypeScript 5.9 | Static typing across the full stack |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Bar charts on the results dashboard |
| Wouter | Lightweight client-side routing |
| React Hook Form + Zod | Form state management and validation |
| Express 5 | REST API server |
| Drizzle ORM | Type-safe PostgreSQL query builder |
| PostgreSQL | Persistent storage for survey responses |
| pnpm Workspaces | Monorepo package management |
| Orval | OpenAPI → React Query + Zod code generation |
| Azure Static Web Apps | Frontend hosting |

## Getting Started

### Prerequisites

- [Node.js 24+](https://nodejs.org/)
- [pnpm 9+](https://pnpm.io/installation)
- A PostgreSQL database (local, Replit built-in, or [Supabase](https://supabase.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bengramigna/free-time-survey.git
   cd free-time-survey
   ```

2. Install all workspace dependencies:
   ```bash
   pnpm install
   ```

3. Set the required environment variables:
   ```bash
   # Create a .env file or export these in your shell
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   SESSION_SECRET=your-session-secret
   ```

4. Push the database schema:
   ```bash
   pnpm --filter @workspace/db run push
   ```

5. Generate the API client from the OpenAPI spec:
   ```bash
   pnpm --filter @workspace/api-spec run codegen
   ```

6. Start both the API server and the frontend:
   ```bash
   # Terminal 1 — API server
   pnpm --filter @workspace/api-server run dev

   # Terminal 2 — Frontend
   PORT=5173 BASE_PATH=/ pnpm --filter @workspace/free-time-survey run dev
   ```

## Usage

Open `http://localhost:5173` in your browser.

- **Home page** — choose to take the survey or view current results
- **Survey (`/survey`)** — fill out all four questions and submit; a thank-you screen confirms your entry
- **Results (`/results`)** — view aggregated charts across all submissions; no individual responses are shown

**Environment variables:**

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Full PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret used to sign sessions |
| `PORT` | Yes (Replit/dev) | Port the dev server listens on |
| `BASE_PATH` | Yes (Replit/dev) | URL base path prefix (use `/` locally) |

**Supabase setup:** Run `artifacts/supabase_setup.sql` in the Supabase SQL Editor to create the table and Row Level Security policies.

**Azure deployment:** Set the following in your Azure Static Web App build configuration:
- App location: `artifacts/free-time-survey`
- Build command: `pnpm install && pnpm run build`
- Output location: `dist/public`

## Project Structure

```
free-time-survey/
├── artifacts/
│   ├── api-server/                  # Express 5 REST API
│   │   └── src/
│   │       ├── app.ts               # Express app setup, CORS, middleware
│   │       ├── index.ts             # Server entry point, reads PORT
│   │       ├── lib/logger.ts        # Pino structured logger
│   │       └── routes/
│   │           ├── index.ts         # Root router, mounts sub-routers
│   │           ├── health.ts        # GET /api/healthz
│   │           └── survey.ts        # POST /api/survey, GET /api/survey/results
│   ├── free-time-survey/            # React + Vite frontend
│   │   ├── public/
│   │   │   └── staticwebapp.config.json  # Azure SPA routing fallback
│   │   └── src/
│   │       ├── App.tsx              # Root component, Wouter router setup
│   │       ├── index.css            # Tailwind theme, CSS custom properties
│   │       ├── components/
│   │       │   └── layout.tsx       # Shared header, footer, page wrapper
│   │       └── pages/
│   │           ├── home.tsx         # Landing page with CTA buttons
│   │           ├── survey.tsx       # Survey form with validation
│   │           └── results.tsx      # Aggregated results with Recharts
│   └── supabase_setup.sql           # SQL script for Supabase table + RLS
├── lib/
│   ├── api-spec/openapi.yaml        # OpenAPI 3.1 contract (source of truth)
│   ├── api-client-react/            # Generated React Query hooks (via Orval)
│   ├── api-zod/                     # Generated Zod schemas (via Orval)
│   └── db/
│       └── src/schema/survey.ts     # Drizzle table definition for survey_responses
├── scripts/                         # Utility scripts workspace package
├── pnpm-workspace.yaml              # Workspace package discovery and catalog
├── tsconfig.json                    # Root TypeScript solution file (libs only)
└── README.md                        # This file
```

## Changelog

### v1.0.0 — 2026-03-30

- Initial release
- Four-question survey form (GPA, state, sports, Iowa City restaurants)
- Conditional "Other" restaurant text input
- Inline validation with accessible error messages
- Thank-you confirmation screen with answer summary
- Results dashboard: total responses + four Recharts bar charts
- Express 5 REST API with Drizzle ORM + PostgreSQL persistence
- OpenAPI 3.1 spec with Orval codegen (React Query hooks + Zod schemas)
- Azure Static Web Apps deployment configuration
- Supabase SQL setup script with Row Level Security

## Known Issues / To-Do

- [ ] GPA input accepts any free text — add numeric range validation (0.00–4.00) on the server side
- [ ] Results page does not auto-refresh; a student who submits and immediately views results must manually reload to see their entry counted
- [ ] The "Other" restaurant field stores raw user input without normalization — duplicate entries with different casing (e.g., "grill" vs "Grill") are counted separately
- [ ] No rate limiting on `POST /api/survey` — the endpoint can be spammed without restriction
- [ ] The Express API server must be hosted separately for Azure Static Web Apps; there is no bundled Azure Functions backend yet

## Roadmap

- **Azure Functions backend** — port the Express routes to Azure Functions so the entire app (frontend + API) can be deployed as a single Azure Static Web App
- **Admin dashboard** — password-protected page to view, export, and delete individual responses
- **Real-time results** — use WebSockets or polling so the results page updates live as new submissions arrive
- **CSV export** — allow the instructor to download all responses as a spreadsheet from the results page
- **Question editor** — make survey questions configurable without code changes, enabling reuse across future semesters

## Contributing

Contributions are welcome for bug fixes and improvements. Please open an issue first to discuss any significant changes before submitting a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: describe your change"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request against `main` with a clear description of what was changed and why

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Ben Gramigna**
University of Iowa — Tippie College of Business
BAIS:3300 Business Applications of Artificial Intelligence and Information Systems — Spring 2026

## Contact

GitHub: [github.com/bengramigna](https://github.com/bengramigna)

## Acknowledgements

- [Recharts](https://recharts.org/) — composable charting library for React
- [Drizzle ORM](https://orm.drizzle.team/) — TypeScript-first ORM for PostgreSQL
- [Orval](https://orval.dev/) — OpenAPI to TypeScript code generation
- [shadcn/ui](https://ui.shadcn.com/) — accessible component primitives built on Radix UI
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS framework
- [Vite](https://vite.dev/) — fast frontend build tooling
- [Azure Static Web Apps documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/) — deployment configuration reference
- [Supabase documentation](https://supabase.com/docs) — database setup and Row Level Security reference
- [Replit](https://replit.com/) — development environment and hosting
- AI assistant (Replit Agent) — used to scaffold, implement, and iterate on the full-stack application
