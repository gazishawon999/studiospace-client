# StudioSpace Client — Creative Workspace & Studio Sharing Platform

Frontend web application for **StudioSpace**, built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Lucide React, Swiper.js, Sonner
- **Authentication**: Better Auth + Google OAuth (hosted by the Express backend), HTTPOnly JWT cookies

## Requirements

- Node.js 20+
- The backend API running at <http://localhost:5000>

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your local environment file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Start the backend first, then the client:
   ```bash
   cd ../studiospace-server
   npm run dev

   # in a second terminal
   cd studiospace-client
   npm run dev
   ```

4. Open <http://localhost:3000>.

## Environment

The client only uses public values:

| Variable | Local value |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` |

All credentials (MongoDB, Better Auth, Google OAuth, JWT, ImgBB) live in
`studiospace-server/.env`, never in this repository.

- Template: [`.env.example`](.env.example)
- Copy-ready file: [`.env.local.example`](.env.local.example)
- Guide: [`docs/environment.md`](docs/environment.md)

`.env` and every `.env.*` file except the two examples above are git-ignored.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Production build (validates `NEXT_PUBLIC_*`). |
| `npm start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npx tsc --noEmit` | Type-check without emitting. |

## Notes

- The homepage loads featured studios from the live API and shows honest empty
  and error states.
- `/studios` is currently a placeholder; category filtering and auth arrive in
  later phases.
- When deploying, set both `NEXT_PUBLIC_*` variables in Vercel and redeploy —
  they are embedded at build time.
