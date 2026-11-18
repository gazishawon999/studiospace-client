# Environment Variables — StudioSpace Client

The Next.js client has **no secrets**. It only needs two public URLs. Every
credential (MongoDB, Better Auth, Google OAuth, JWT, ImgBB) lives in the Express
backend: `studiospace-server/.env`. See `studiospace-server/docs/environment.md`
for the full credential guide.

- Template: [`../.env.example`](../.env.example)
- Copy-ready local file: [`../.env.local.example`](../.env.local.example)
- Validator: [`../src/lib/env.ts`](../src/lib/env.ts)

---

## 1. Variables

| Variable | Required | Local value | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` | Public origin of this app. Used for `metadataBase`, canonical URLs, and Open Graph links. Origin only — no path, no trailing slash. |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5000/api` | Base URL of the Express API, including `/api`. Used by `apiFetch` for server- and client-side requests. |

Both variables are prefixed with `NEXT_PUBLIC_`, which means Next.js embeds them
in the JavaScript bundle. They are **public by definition** and must never hold a
credential.

### Not used by the client

| Variable | Why it is not here |
| --- | --- |
| `MONGODB_URI`, `DB_NAME` | Only the Express server talks to MongoDB. |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Better Auth runs on Express. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth is handled server-side. |
| `JWT_SECRET` | Express signs the HTTPOnly cookie. |
| `IMGBB_API_KEY` | Image uploads go through an authenticated Express endpoint; the browser never sees the key. |

If an older copy of your `.env.local` still contains any of these, delete those
lines. The backend `.env` is the only place they belong.

---

## 2. Local setup

From `studiospace-client/`:

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

The app runs at <http://localhost:3000> and calls the API at
<http://localhost:5000/api>. Start the backend first so data loads:

```bash
cd ../studiospace-server
npm run dev
```

Files:

| File | Committed? | Loaded by Next.js? |
| --- | --- | --- |
| `.env.example` | Yes | No — documentation only. |
| `.env.local.example` | Yes | No — copy template. |
| `.env.local` | **No** (git-ignored) | Yes, highest priority for local dev. |
| `.env`, `.env.production`, … | **No** (git-ignored) | Yes, by environment. |

---

## 3. Validation behaviour

`src/lib/env.ts` validates both URLs when the module is imported:

- Missing in **development** → falls back to the local URLs above.
- Missing in **production** → throws, so `next build` fails instead of shipping
  broken links.
- Malformed URL, non-HTTP(S) protocol, or a path on `NEXT_PUBLIC_APP_URL` →
  throws.
- `NEXT_PUBLIC_API_URL` without a trailing `/api` segment, or with a query
  string/hash → throws. `apiFetch` appends paths such as `/studios`, and Better
  Auth is mounted at `/api/auth`.
- Non-HTTPS values in production → warning.

Auth requests go to `NEXT_PUBLIC_API_URL` + `/auth/...`, so the Better Auth
client `baseURL` is the backend origin (`http://localhost:5000` locally), not
the frontend origin.

---

## 4. Production (Vercel)

Set both variables in **Project → Settings → Environment Variables** for the
Production (and Preview) environments:

```dotenv
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
```

Redeploy after changing them: `NEXT_PUBLIC_*` values are baked in at build time.

On the backend, add the same frontend origin to `CLIENT_URL` and set
`AUTH_COOKIE_SECURE=true`.

---

## 5. Verification

```bash
# Type-check the client
npx tsc --noEmit

# Production build (validates NEXT_PUBLIC_* values)
npm run build

# Confirm no env files are tracked
git ls-files | Select-String -Pattern '^\.env'
```

Expected tracked files: `.env.example` and `.env.local.example` only.
