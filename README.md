# Lil Sprouts

A childcare / nanny business management app. Lil Sprouts helps an in-home
caregiver (or small childcare business) manage client families, schedule and
track care sessions, log daily reports and incidents, and keep records of
payments and expenses for tax time. It is built as an installable PWA so it
works well on a phone in the field.

## Features

- **Families & contacts** – manage client families, their children (allergies,
  medications, special needs, school info), and additional family members with
  pickup authorization.
- **Services** – configurable service types (e.g. Childcare, Piano Lesson) with
  per-service default hourly rates and pricing modes (flat or per-child).
- **Care schedules** – recurring schedule templates (weekly, biweekly, monthly,
  or one-time) that generate care sessions.
- **Care sessions** – scheduled vs. actual times, drop-off/pickup tracking,
  per-meal counts, status (scheduled → in progress → completed / cancelled),
  and confirmation flags.
- **Session reports** – log incidents, accidents, behavior notes, meals, naps,
  activities, medication, milestones, and general updates, with severity levels
  and follow-up flags.
- **Payments** – track amounts, status (pending/paid/overdue), method, invoice
  numbers, and tax year for income reporting.
- **Expenses** – standalone business expenses and per-session expenses, with
  optional categories.
- **Reports** – dashboards plus income, calendar, and year-end tax views.
- **Dashboard** – upcoming sessions, recent incidents, hours/earnings widgets
  (week / month / YTD), and a quick-add session modal.
- **Accounts & auth** – session-based login for the owner and (optionally)
  invited family members.
- **PWA** – installable, with offline app-shell behavior via a service worker.

## Tech stack

- [SolidStart](https://start.solidjs.com) (Solid + Vinxi) for the full-stack app
- [Prisma 7](https://www.prisma.io/) ORM with the `@prisma/adapter-pg` driver
  adapter
- PostgreSQL database
- `vite-plugin-pwa` / Workbox for the PWA service worker
- TypeScript

## Prerequisites

- Node.js **>= 22**
- A PostgreSQL database
- [pnpm](https://pnpm.io/) (this repo uses a `pnpm-lock.yaml` / workspace)

## Getting started

1. **Configure npm auth for Web Awesome Pro** (required before install/build)

   Web Awesome Pro is a private Cloudsmith package. Export your token, then install:

   ```bash
   export WEBAWESOME_NPM_TOKEN="your_cloudsmith_token"
   pnpm install
   ```

   On Windows (PowerShell): `$env:WEBAWESOME_NPM_TOKEN="your_cloudsmith_token"`.
   See `.npmrc.example`. Without this token, `pnpm build` fails during SSR with unresolved CSS imports from `@web.awesome.me/webawesome-pro`.

2. **Configure environment variables**

   Create a `.env` file in the project root (it is git-ignored):

   ```bash
   # PostgreSQL connection string
   DATABASE_URL="postgresql://user:password@localhost:5432/lilsprouts?schema=public"

   # Secret used to sign session cookies — set a long random value in production
   SESSION_SECRET="replace-with-a-long-random-string"

   # Public origin used to build absolute redirect URLs (production)
   PUBLIC_ORIGIN="https://your-domain.example"
   ```

   See [Environment variables](#environment-variables) below for the full list.

3. **Set up the database**

   Generate the Prisma client and run migrations:

   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

4. **Run the dev server**

   ```bash
   pnpm dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000). Create the
   first account via the **Register** option on the login page.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Vinxi dev server |
| `pnpm build` | Check deps, generate Prisma client, build for production |
| `pnpm check-deps` | Verify private Web Awesome package is installed |
| `pnpm start` | Run the built production server |
| `pnpm prisma:generate` | Generate the Prisma client into `src/generated/prisma-client` |
| `pnpm prisma:migrate` | Create/apply a dev migration (`prisma migrate dev`) |
| `pnpm prisma:migrate:deploy` | Apply migrations in production (`scripts/migrate.js deploy`) |
| `pnpm prisma:migrate:status` | Show migration status (`scripts/migrate.js status`) |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. Supports optional SSL cert params (`sslcert=`, `sslrootcert=`, `sslkey=`), which are resolved to absolute paths at startup. |
| `SESSION_SECRET` | Yes | Secret for signing session cookies. Required at runtime (no insecure fallback). |
| `WEBAWESOME_NPM_TOKEN` | Yes (install/build) | Cloudsmith token for `@web.awesome.me/webawesome-pro`. Used by `.npmrc` during `pnpm install`. |
| `PUBLIC_ORIGIN` | Recommended | Absolute public origin used to build redirect URLs. `APP_ORIGIN`, `SITE_URL`, and `URL` are also accepted, as are host-only platform vars (`VERCEL_URL`, `RENDER_EXTERNAL_HOSTNAME`, `RAILWAY_PUBLIC_DOMAIN`). |
| `NODE_ENV` | No | Set to `production` in production builds. |

## Project structure

```
prisma/
  schema.prisma          # Data model (families, children, sessions, payments, …)
src/
  app.tsx                # Root component / router shell
  middleware/            # Request middleware (URL normalization for Nitro/Vinxi)
  components/            # Shared UI (Topbar, ClientTime, …)
  routes/                # File-based routes (families, schedule, payments, …)
  lib/                   # Server data layer (queries/actions) + helpers
    db.ts                # Prisma client + pg pool setup
    server.ts            # Auth helpers (login/register/session)
    money.ts             # Precise currency math (cents-based)
    ...
  generated/prisma-client/  # Generated Prisma client (built artifact)
  styles/                # Responsive CSS
public/
  manifest.json          # PWA manifest
  icons/                 # PWA icons
app.config.ts            # SolidStart + PWA + Prisma externalization config
prisma.config.ts         # Prisma datasource/migrations config
ecosystem.config.js      # PM2 process config for production
```

## Data model

The schema (`prisma/schema.prisma`) centers on a `Family` and its related
records:

- `Family` → `Child`, `FamilyMember`, `CareSchedule`, `CareSession`, `Payment`,
  `Expense`, `Document`, and assigned `Service`s (via `FamilyService`).
- `CareSchedule` is a recurring template that produces `CareSession`s.
- `CareSession` links a `Family`, a `Service`, optional children, and has
  `SessionReport`s, `SessionExpense`s, and `Payment`s.
- `User` accounts back the owner login and optional family-member access;
  `Unavailability` records block out the caregiver's calendar.

## Deployment

The default build target is a Node server.

```bash
pnpm build
pnpm start
```

A PM2 config is included for running the built server in production:

```bash
pm2 start ecosystem.config.js
```

`ecosystem.config.js` loads environment variables from `.env` and runs
`.output/server/index.mjs`. Apply pending migrations on deploy with
`pnpm prisma:migrate:deploy`.

> **Security note:** This app currently stores user passwords in plaintext and
> only enforces authentication at the route/UI level (server data functions are
> not individually gated). Review and harden authentication, password hashing,
> and `SESSION_SECRET` before exposing it to real client data.

## License

Private project. All rights reserved unless stated otherwise.
