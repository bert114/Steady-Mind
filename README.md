# Aura — local dev notes

This repository contains the Aura frontend (client/) and backend (server/).

Environment

- Copy `server/.env.example` to `server/.env` and set the following variables (scaffolding expects them but won’t fail if missing):
  - `DATABASE_URL` — Neon/Postgres connection string
  - `CLERK_ENABLED` — set to `true` to enable Clerk middleware
  - `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` — Clerk credentials when enabled
  - `OPENAI_API_KEY` — only required if you enable AI features

Running locally

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

Notes

- The server scaffolds endpoints for energy logs, interactions, coping activities, and biometric ingestion under `/api/v1`.
- Clerk middleware is enabled only when `CLERK_ENABLED=true` so you can develop without Clerk configured.
- Database migrations are not included; create the required tables before using the endpoints, or mock the DB layer for early development.
