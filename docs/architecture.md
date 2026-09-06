# Server-Side Architecture

Production foundation for Supabase (auth, database, RLS) + Cloudflare R2 (media storage) +
an authorization-protected `/admin` route group.

## Environment Configuration

All environment access goes through `config/env.ts` — never read `process.env.X` directly
elsewhere. Two schemas (Zod-validated):

- `getClientEnv()` — safe for the browser. Only `NEXT_PUBLIC_*` variables plus `NODE_ENV`.
- `getServerEnv()` — server-only (throws if called from `typeof window !== "undefined"`).
  Extends the client schema with all privileged credentials.

Helper booleans (`isSupabaseConfigured`, `isSupabaseAdminConfigured`, `isR2Configured`) let
code degrade gracefully (e.g. render placeholder client, log a warning) instead of crashing
when credentials aren't set yet, while privileged clients still hard-fail with a clear error
if used without configuration.

See `.env.example` for the full variable list (names only — real values go in
`.env.local`, which is git-ignored and must never be committed).

## Supabase

Three client boundaries in `lib/supabase/`, matching `@supabase/ssr` conventions:

| Client | File | Key used | Use |
|---|---|---|---|
| Browser | `client.ts` | anon key | Client Components |
| Server | `server.ts` | anon key + user cookies | Server Components, Server Actions, Route Handlers |
| Admin | `admin.ts` | service role key | Trusted, server-only, privileged operations. **Bypasses RLS.** |

The admin client (`createAdminClient`) is a singleton guarded by `isSupabaseAdminConfigured()`
and marked `import "server-only"` — it cannot be imported into a `"use client"` module without
a build error. Use the server client + RLS by default; reach for the admin client only when an
operation genuinely requires bypassing RLS (e.g. changing a user's role).

### Database & RLS

`supabase/migrations/0001_init_schema.sql` establishes the schema already declared in
`lib/supabase/types.ts`:

- `user_role` enum (`admin`, `staff`, `user`)
- `profiles` — one row per `auth.users` entry, auto-created via an `on_auth_user_created`
  trigger. RLS: a user can read/update their own row; admins can read/update all rows; no
  policy allows a user to change their own `role` (prevents privilege escalation — role
  changes must go through the service-role admin client).
- `media_assets` — metadata for objects stored in Cloudflare R2. RLS: publicly readable,
  insert/delete restricted to `staff`/`admin`.
- `is_admin(user_id)` — `security definer` SQL function usable inside RLS policies.

This migration has **not** been applied to any live Supabase project by this change — it
needs to be run via the Supabase SQL editor or `supabase db push` (see `supabase/README.md`).

### Authentication vs. Authorization

- **Authentication** (`lib/auth/session.ts`): `getCurrentUser()` calls
  `supabase.auth.getUser()`, which verifies the token against the Supabase Auth server (not a
  local cookie decode).
- **Authorization** (`lib/auth/roles.ts`, `lib/auth/session.ts`): `requireAuth()` throws
  `AuthenticationError` if there's no session; `requireAdmin()` additionally throws
  `ForbiddenError` if the user's profile role isn't `admin`.

## Authentication Flow (Login / Register / Logout)

`app/login/` and `app/register/` are the general-purpose auth entry points for any user (not
admin-specific) — `app/admin/layout.tsx`'s `requireAdmin()` is what actually restricts `/admin`
to admins, on top of this.

- **Login** (`components/auth/login-form.tsx` + `app/login/actions.ts`): a Server Action calls
  `supabase.auth.signInWithPassword()`. Failure is always the generic **"Invalid email or
  password"** — Supabase itself returns the same `invalid_credentials` error for a wrong
  password, a nonexistent email, *and* a correct password on an unconfirmed account, so there's
  no oracle to special-case around even if we wanted one (verified live against this project).
  A `redirectTo` param (set by `proxy.ts` when it bounces an unauthenticated visitor away from
  `/admin`) is round-tripped through a hidden field and re-validated server-side via
  `lib/utils/safe-redirect.ts` before use — it must be a same-origin relative path, rejecting
  absolute/protocol-relative targets, so a crafted `?redirectTo=` can't produce an open redirect.
- **Register** (`components/auth/register-form.tsx` + `app/register/actions.ts`): calls
  `supabase.auth.signUp()`. This project has **email confirmation required**
  (`mailer_autoconfirm: false`, confirmed against the live project) and only the shared/default
  Supabase mailer configured (no custom SMTP — its send rate limit is very low, encountered
  directly while testing this). So the expected path after registering is "check your email,"
  not immediate login. Existing-account handling follows Supabase's own anti-enumeration
  contract: `signUp()` on an already-registered email doesn't error, it returns a user with an
  empty `identities` array — the code detects that and shows "an account may already exist, try
  logging in" instead of probing for existence itself.
- **Logout** (`lib/auth/actions.ts`): `supabase.auth.signOut()` via a Server Action, invoked from
  a plain `<form action={logout}>` in the Navbar — an actual session invalidation, not just
  clearing client state.
- **Password fields** (`components/auth/password-input.tsx`): shared show/hide component, real
  `aria-label`/`aria-pressed` button (not icon-only), fixed-width toggle so revealing the
  password never shifts layout.

## `/admin` Route Protection (Defense in Depth)

Two layers, per Next.js's own guidance that Proxy is an optimistic check only:

1. **`proxy.ts`** (root — Next.js 16 renamed `middleware.ts` to `proxy.ts`) refreshes the
   Supabase session cookie on every request and does an **optimistic** redirect: no session →
   redirect `/admin/*` to `/login?redirectTo=<original path>`; existing session → redirect
   `/login` or `/register` to `/` (home, not `/admin` — login is general-purpose now, not
   admin-only). It does **not** check role — only presence of a session — to keep it cheap on
   every request (including prefetches).
2. **`app/admin/layout.tsx`** is the authoritative check. It calls `requireAdmin()` on every
   render of any `/admin/*` route, which re-verifies the user against Supabase and checks
   their profile role. `AuthenticationError` → redirect to `/login`; `ForbiddenError` → redirect
   to `/admin/unauthorized`.

Any future Server Action or Route Handler under `/admin` (or elsewhere) that performs a
privileged operation must call `requireAdmin()` (or `requireAuth()`) itself — never rely on the
proxy or the layout alone, since Server Actions can be invoked directly.

Admin/staff accounts are provisioned via the seed script below, not self-registration — a
regular `/register` signup always gets the default `user` role from the `profiles` table.

## Navbar Auth Awareness

`app/layout.tsx` (the root layout) is now `async` and calls `getAuthSession()`, passing a
trimmed `NavAuthState` DTO (`{ isAuthenticated, displayName, isAdmin }` — not the full
Supabase `User`/`UserProfile` objects) into `<Navbar>`. `components/navbar/auth-nav.tsx`
renders "Login" or the user's name + "Logout" from that, reused for both the desktop header
and the mobile drawer.

**Trade-off, stated explicitly:** since the root layout now reads cookies on every request,
the entire app (including the marketing homepage `/`) lost static prerendering and is fully
dynamic (`ƒ`) per the build output. This is the expected, standard cost of an app-wide
auth-aware nav without Partial Prerendering (not enabled in this project) — not a bug.

### Admin Seed

`scripts/seed-admin.ts` (run via `npm run seed:admin`) creates the first admin account so
there's a way to sign in to `/login` at all. It reads `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD`
from `.env.local`, creates (or reuses, if it already exists) that Supabase Auth user via the
Admin API, and sets its `profiles.role` to `admin` using the service-role client — the same
bootstrap problem RLS can't solve itself, since no admin exists yet to grant the first one.
Safe to re-run. Requires `supabase/migrations/0001_init_schema.sql` to already be applied
(the `profiles` row is created by that migration's trigger before the script updates its role).

The script runs standalone via `tsx`, outside the Next.js server runtime — it builds its own
Supabase admin client rather than importing `lib/supabase/admin.ts`, whose `import "server-only"`
guard throws when loaded outside Next's server bundling (that guard is exactly why it can't be
reused here; it's doing its job).

## Cloudflare R2 (Media Storage)

**Decision: Cloudflare R2**, not Cloudflare Images (user choice — R2 was selected for general
object storage flexibility over Images' resize/delivery specialization). One bucket
(`R2_BUCKET`), publicly delivered via `NEXT_PUBLIC_R2_PUBLIC_URL` (an `*.r2.dev` public bucket
link, or a custom domain in front of it).

`lib/cloudflare/`:

- `r2-client.ts` — singleton S3-compatible client (`@aws-sdk/client-s3`), pointed at
  `https://<account-id>.r2.cloudflarestorage.com`. Server-only.
- `validation.ts` — treats every uploaded file as untrusted: size limit, MIME allowlist,
  extension allowlist, and binary magic-byte verification (rejects a `.png`-named file that
  isn't actually a PNG), then produces a sanitized, collision-resistant filename.
- `service.ts` — `uploadMediaToR2()` and `deleteMediaFromR2()`. These perform **no**
  authorization checks themselves; callers must call `requireAdmin()`/`requireAuth()` first.

No upload route or admin UI has been built yet (out of scope for this foundation task — "do
not build the actual dashboard yet"). The intended flow for whichever feature adds uploads:

```
Admin browser → Server Action/Route Handler → requireAdmin() → validateMediaFile()
  → uploadMediaToR2() → insert row into media_assets (Supabase)
```

**Failure handling / orphan prevention:** if the Supabase metadata insert fails after the R2
upload succeeds, the feature that wires this up should call `deleteMediaFromR2(storageKey)` in
the catch block to avoid an orphaned object. This is documented here rather than pre-built as
a combined transaction helper, since no real upload feature exists yet to validate the pattern
against (avoiding premature abstraction).

## Error Handling & Logging

- `lib/errors/app-error.ts` — typed `AppError` subclasses (`ValidationError`,
  `AuthenticationError`, `ForbiddenError`, `NotFoundError`, `ExternalServiceError`,
  `DatabaseError`), each with a stable `code` and HTTP `statusCode`.
- `lib/errors/error-handler.ts` — `handleServerError()` converts any caught error into a safe
  JSON-serializable shape; unrecognized errors return a generic message in production (full
  message only in development) so internals never leak to clients.
- `lib/logging/logger.ts` — structured JSON logging with `scrubSensitiveData()`, which
  redacts any key matching a sensitive-word list (`password`, `token`, `secret`, `key`,
  `service_role`, etc.) before it reaches `console.*`.

## Server/Client Boundary

Server Components by default. `"use client"` only where interactivity is required (the login
form, for `useActionState`). Every module that touches a privileged credential
(`lib/supabase/admin.ts`, `lib/supabase/server.ts`, `lib/cloudflare/r2-client.ts`,
`lib/cloudflare/service.ts`, `lib/auth/session.ts`) is marked `import "server-only"`, so
importing one into a Client Component fails at build time rather than leaking a secret into
the browser bundle at runtime.

## What Was Already Done vs. Completed Now

See the takeover report in the conversation this document was produced from for the full
breakdown. In short: environment validation, Supabase client separation, auth/session
helpers, error handling, logging, and file-upload validation already existed. This change
added: `proxy.ts` (the session-refresh/auth wiring was previously dead code — nothing invoked
`updateSession()`), the `/admin` + `/login` route foundation, the R2 client/service, the
database migration + RLS policies, and this document.
