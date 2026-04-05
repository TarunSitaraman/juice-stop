# CLAUDE.md — Juice Stop Project Context

This file exists to survive autocompaction. It contains everything a fresh Claude session needs to understand and continue this project without any prior conversation context.

---

## What This Project Is

**Juice Stop** is a cloud-deployed restaurant ordering and delivery management platform for a college residency juice shop. It replaces manual phone-based ordering with a digital pipeline consisting of:

1. **Customer Web App** — browse menu, place order, get ticket number, optionally track status
2. **Restaurant Mobile App** — receive real-time order notifications, manage order lifecycle, upload UPI payment proof photos
3. **Cloud Backend** — REST API + WebSocket server, PostgreSQL database, Redis cache, blob storage

**All services are cloud-deployed and communicate over the public internet (HTTPS/WSS). Nothing is local-only.**

---

## Monorepo Structure

```
juice-stop/  (root = C:\Users\Tarun\Documents\juicestop\juice stop)
├── apps/
│   ├── web/        Next.js 15 App Router — customer-facing web app
│   └── mobile/     Expo React Native — restaurant staff mobile app
├── packages/
│   ├── api/        Express.js + Socket.io — REST API + WebSocket server
│   ├── db/         Prisma schema + client — connected to Neon PostgreSQL
│   └── shared/     Shared TypeScript types and Zod validators
├── turbo.json
├── package.json    Turborepo workspace root
├── CLAUDE.md       ← this file
└── README.md       Full architecture documentation with diagrams
```

---

## Tech Stack (Locked In — Do Not Change Without Discussion)

### Customer Web App (`apps/web`)
- **Next.js 15** with App Router
- **Tailwind CSS** + **shadcn/ui** for UI
- **Zustand** for cart state (persisted to localStorage)
- **TanStack Query** for server data fetching + order status polling
- **Socket.io client** for real-time order status updates
- Deployed to **Vercel**

### Restaurant Mobile App (`apps/mobile`)
- **Expo** (React Native) — cross-platform iOS + Android
- **Expo Push Notifications + FCM** for order alerts
- **expo-image-picker** for UPI payment proof photos
- **Zustand** for state
- **Socket.io client** for real-time order push
- Deployed via **Expo EAS**

### Backend API (`apps/web/app/api/`)
- **Next.js Route Handlers** (no Express — runs on Vercel Functions)
- **Prisma** ORM with parameterized queries (no raw SQL)
- **JWT + bcrypt** for restaurant staff auth
- **@upstash/ratelimit** for rate limiting (serverless-compatible)
- **@vercel/blob** for payment proof photo uploads
- Deployed to **Vercel** as part of the Next.js app
- No WebSockets — restaurant mobile app uses polling (every 5s)

### Database (`packages/db`)
- **Neon PostgreSQL** — primary database
- **Upstash Redis** — ticket counter (`INCR ticket:seq`), rate limiting, refresh token store
- **Vercel Blob** — payment proof photo storage (private, signed URLs)

---

## Cloud Deployment Targets

| Service | Platform | Notes |
|---------|---------|-------|
| Customer Web App | Vercel | Auto-deploys from GitHub main branch |
| API + WebSocket | Railway | Persistent process, not serverless |
| Database | Neon PostgreSQL | Free tier, serverless-compatible |
| Cache | Upstash Redis | Serverless Redis |
| File storage | Vercel Blob | Private blobs, signed URLs for access |
| Mobile App | Expo EAS | OTA updates, no app store required for internal use |

---

## Environment Variables

### `apps/web` — `.env.local`
```
NEXT_PUBLIC_API_URL=https://api.juicestop.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://api.juicestop.up.railway.app
```

### `packages/api` — `.env`
```
DATABASE_URL=postgresql://...@neon.tech/juicestop
REDIS_URL=rediss://...@upstash.io:6380
JWT_SECRET=<long random string>
JWT_REFRESH_SECRET=<different long random string>
BLOB_READ_WRITE_TOKEN=<vercel blob token>
CORS_ORIGINS=https://juicestop.vercel.app
PORT=3001
NODE_ENV=production
```

---

## Database Schema (Prisma — `packages/db/prisma/schema.prisma`)

Models:
- **Category** — id, name, slug, sortOrder, menuItems[]
- **MenuItem** — id, categoryId, name, description, price, imageUrl, available, sortOrder
- **Order** — id, ticketId (JC-0001), customerPhone, deliveryAddress, deliveryNotes, status, proofImageUrl, totalAmount, timestamps
- **OrderItem** — id, orderId, menuItemId, quantity, unitPrice
- **Staff** — id, name, email, passwordHash, role (ADMIN | STAFF), createdAt

Order status enum: `PENDING → IN_PREPARATION → SENT_FOR_DELIVERY → COMPLETED` (or `REJECTED` from `PENDING`)

---

## Ticket ID System

- Redis atomic counter: `INCR ticket:seq`
- Format: `JC-0001`, `JC-0002`, etc.
- Guaranteed unique even under concurrent load

---

## API Endpoints

### Public
- `GET  /api/menu` — full menu with categories
- `GET  /api/menu/categories`
- `POST /api/orders` — create order (returns ticketId)
- `GET  /api/orders/:id` — get by UUID
- `GET  /api/orders/ticket/:ticketId` — get by ticket

### Authenticated (restaurant staff JWT)
- `POST   /api/auth/login`
- `POST   /api/auth/refresh`
- `POST   /api/auth/logout`
- `GET    /api/restaurant/orders` — list with status filter
- `PATCH  /api/restaurant/orders/:id/status`
- `POST   /api/restaurant/orders/:id/proof` — upload photo
- `PATCH  /api/menu/items/:id/availability`

### Socket.io Events
- Server → Client: `new_order`, `order_updated`
- Client joins `restaurant` room on auth

---

## Key Decisions & Rationale

- **Railway over Vercel for API**: Vercel Functions are stateless and don't support persistent WebSocket connections. Railway runs a persistent Node process.
- **Turborepo monorepo**: Shared TypeScript types across web, mobile, and API. Single repo, single PR flow.
- **No payment gateway**: Cash on delivery only. UPI proof is just a photo uploaded by delivery staff — no API integration needed.
- **Expo over bare React Native**: OTA updates mean the restaurant can get app fixes without going through the App Store.
- **Neon over Supabase**: Lighter footprint, better Prisma integration, serverless branching for dev/prod parity.
- **Upstash over self-hosted Redis**: Serverless, no persistent infra to manage.

---

## Security Rules (Do Not Violate)

- Never log or expose `customerPhone` in list endpoints or server logs
- All uploads must be MIME-validated server-side (images only, max 5MB)
- All SQL via Prisma — never concatenate raw SQL strings
- CORS locked to web app origin only
- JWT access tokens: 8hr expiry. Refresh tokens: 7 days, stored in Redis, rotatable

---

## Current Build Status

- [ ] Turborepo monorepo scaffolded
- [ ] `packages/db` — Prisma schema written
- [ ] `packages/shared` — TypeScript types written
- [ ] `packages/api` — Express server scaffolded
- [ ] `apps/web` — Next.js app scaffolded with menu + cart + order form
- [ ] `apps/mobile` — Expo app scaffolded
- [ ] Cloud services provisioned (Neon, Upstash, Railway, Vercel)
- [ ] End-to-end tested

Update these checkboxes as work progresses.

---

## What To Work On Next (if resuming fresh)

1. Check the build status checkboxes above
2. Read `README.md` for full architecture diagrams and API spec
3. The most likely next task is whichever checkbox is first unchecked
4. Always run `npm install` from repo root before making changes
5. Always keep `NEXT_PUBLIC_API_URL` pointing to the Railway API, never localhost

---

## Project Owner

- **Developer**: Tarun Sitaraman
- **Platform**: Windows 11, using Claude Code CLI
- **Repo**: `C:\Users\Tarun\Documents\juicestop\juice stop` (git: main branch)
