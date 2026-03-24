# Global Mail Service

A clean, white-themed mail provider login UI built with **Next.js 14 (App Router)**, **TypeScript**, **Prisma**, and **CSS Modules**.

## Features

- ✉️ 8 mail providers: Google, Yahoo, Outlook/Hotmail, AOL, Mail.com, iCloud, Proton Mail, Office 365
- 🎨 Clean white theme with per-provider brand color accents
- 📋 Sign-in logs every attempt: username, provider, timestamp, IP address, user agent
- 📍 Optional geolocation (city, country, lat/lng) via browser API + Nominatim
- 🔒 Simple backend API route (`POST /api/signin`)
- 💾 SQLite (dev) or PostgreSQL (prod) via Prisma

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

The default `.env` uses SQLite (`file:./dev.db`) — no extra setup needed for development.

For production with PostgreSQL, update `DATABASE_URL` and the `provider` in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Initialize the database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database (creates tables)
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/login`.

---

## View Sign-in Logs

```bash
npm run db:studio
```

Opens Prisma Studio at `http://localhost:5555` where you can browse all `SignInLog` entries.

---

## Project Structure

```
global-mail-service/
├── prisma/
│   └── schema.prisma          # Database schema (SignInLog model)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout + Google Fonts
│   │   ├── globals.css        # Global styles + dot-grid background
│   │   ├── page.tsx           # Redirects → /login
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   └── api/
│   │       └── signin/
│   │           └── route.ts   # POST /api/signin (logs to DB)
│   ├── components/
│   │   ├── LoginCard.tsx      # Main UI component (client)
│   │   └── LoginCard.module.css
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       └── providers.ts       # Mail provider configs
├── .env                       # Local env (git-ignored)
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Database Schema

```prisma
model SignInLog {
  id         Int      @id @default(autoincrement())
  username   String                  // email address entered
  provider   String                  // provider id (e.g. "google")
  signedInAt DateTime @default(now())
  ipAddress  String?
  city       String?
  country    String?
  latitude   Float?
  longitude  Float?
  userAgent  String?
}
```

---

## Customization

**Add a provider** — edit `src/lib/providers.ts`:
```ts
{
  id: 'tutanota',
  name: 'Tutanota',
  shortName: 'Tuta',
  color: '#840010',
  textColor: '#fff',
  logoUrl: 'https://...',
  emailHint: 'you@tuta.io',
}
```

**Change the database** — update `prisma/schema.prisma` provider and `DATABASE_URL`, then run `npm run db:push`.

**Deploy to Vercel** — set `DATABASE_URL` in Vercel env vars pointing to a hosted PostgreSQL (e.g. Neon, Supabase, PlanetScale).
