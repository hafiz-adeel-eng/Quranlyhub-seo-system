# Rishta Pakistan

A Pakistan-focused Islamic matrimonial platform, built to go beyond
[rishta.center](https://rishta.center)-style sites in three ways:

1. **City-first SEO** — every major Pakistani city gets its own indexable
   landing page (`/rishta/gujranwala`, `/rishta/gujrat`, `/rishta/jhelum`,
   `/rishta/lahore`, ...). A new profile is instantly attached to its city's
   page — no manual curation needed.
2. **Urdu-first, English on demand** — the whole UI defaults to Urdu (RTL)
   since that's how most people in Pakistan actually browse rishta sites,
   with a one-click toggle to English that remembers the choice.
3. **Pay-to-contact monetization** — browsing, searching and creating a
   profile are completely free. The only paid action is unlocking a
   profile's phone/WhatsApp number, which is exactly where rishta.center
   currently leaves money on the table.

## Tech stack

- **Next.js 14** (App Router, TypeScript, React Server Components)
- **Prisma + SQLite** for local dev (schema is one `provider` line away from
  Postgres/MySQL for production — see below)
- **NextAuth.js** (credentials/email+password) for accounts
- **Tailwind CSS** for styling, with full `dir="rtl"` support for Urdu
- No external UI kit — every component is hand-built and easy to restyle

## Getting started

```bash
npm install
cp .env.example .env        # edit values as needed
npm run db:push             # create the SQLite database from schema.prisma
npm run db:seed             # seed all Pakistani cities + a few demo profiles
npm run dev                 # http://localhost:3000
```

Demo accounts created by the seed script (password: `Demo@12345`):
`demo.ahmed@example.com`, `demo.ayesha@example.com`, `demo.bilal@example.com`,
`demo.sana@example.com`, `demo.usman@example.com`, `demo.hina@example.com`.

## How the pieces fit together

| Concern | Where |
|---|---|
| City list (add a city → its landing page appears automatically) | `src/lib/cities.ts` |
| Urdu/English strings | `src/lib/i18n/dictionaries.ts` |
| Current-locale detection (cookie-based, default `ur`) | `src/lib/i18n/getDictionary.ts` |
| DB schema (User, Profile, City, ContactUnlock) | `prisma/schema.prisma` |
| Profile create/update | `src/app/profile/new`, `POST /api/profiles` |
| City landing pages + SEO metadata | `src/app/rishta/[city]/page.tsx` |
| Cross-city search (city + gender + age filters) | `src/app/search`, `GET /api/profiles` |
| Contact gating logic | `src/app/profile/[id]/page.tsx` |
| Manual payment checkout | `src/app/checkout/[profileId]`, `POST /api/unlock` |
| Admin payment approval | `src/app/admin/unlocks`, `PATCH /api/admin/unlocks` |
| Sitemap / robots for SEO | `src/app/sitemap.ts`, `src/app/robots.ts` |

### Why profile fields are strings, not enums

SQLite (used for local dev) has no native enum type. `Gender`,
`MaritalStatus`, `Sect` and `ContactUnlock.status` are stored as validated
strings instead — the allowed values live once in `src/lib/enums.ts`. If you
switch the datasource to Postgres/MySQL you can reintroduce real Prisma
`enum` blocks in `schema.prisma` if you prefer stricter DB-level validation.

## Monetization: how contact unlocking works today, and how to go live

Everything is free except **seeing a profile's phone/WhatsApp number**. The
flow right now, with no payment gateway keys configured in this
environment:

1. Buyer opens `/checkout/[profileId]`, sees JazzCash/Easypaisa transfer
   instructions with a receiving number (`MANUAL_PAYMENT_NUMBER` /
   `MANUAL_PAYMENT_NAME` in `.env`), and submits their transaction ID.
2. This creates a `ContactUnlock` row with `status: PENDING`.
3. An admin (any email listed in `ADMIN_EMAILS`) opens `/admin/unlocks`,
   verifies the transfer manually, and clicks Approve — this is
   `PATCH /api/admin/unlocks` setting `status: PAID`.
4. Once `PAID`, the buyer's dashboard and the profile page reveal the real
   contact number for that specific profile (and only that one).

**To automate this with a real gateway** (JazzCash/Easypaisa merchant API,
or Stripe if you ever take international cards), replace the body of
`POST /api/unlock` in `src/app/api/unlock/route.ts`:

- Call the gateway's "create payment" API instead of just storing the
  user-submitted reference, and redirect the buyer to its hosted checkout.
- Add a webhook route (e.g. `src/app/api/webhooks/jazzcash/route.ts`) that
  verifies the gateway's signature and flips `ContactUnlock.status` to
  `PAID` server-side — never trust a client-submitted "I paid" claim in
  production the way the manual flow currently does.
- Remove `/admin/unlocks` once webhook-based confirmation is live (or keep
  it as a fallback for manual/bank transfers).

`CONTACT_UNLOCK_PRICE_PKR` in `src/lib/pricing.ts` is the single place that
controls the price.

## SEO strategy for city pages

- `generateStaticParams` in `src/app/rishta/[city]/page.tsx` pre-renders a
  static page per city at build time (32 cities today — add more in
  `src/lib/cities.ts` and they appear automatically, no code changes).
- Each city page has a unique, bilingual `<title>`/meta description built
  from the city name (e.g. "رشتہ گوجرانوالہ | گوجرانوالہ میں شادی کے لیے رشتے").
- `src/app/sitemap.ts` lists every city page and every published profile so
  search engines can discover them without manual submission.
- New profiles appear on their city's page immediately (server-rendered,
  not cached), so a city page's content grows the moment someone signs up
  from that city — this is the core "network effect" loop the whole city-
  first design is built around.

## Deploying to Vercel

This repo has no Vercel project connected yet and no deploy credentials are
configured in this environment, so deployment has to be kicked off from your
own Vercel account (2FA-protected accounts can't be automated from here
anyway). It's a five-minute, click-through process:

1. **Database first** — Vercel's serverless functions run on an ephemeral,
   effectively read-only filesystem, so the SQLite file used in local dev
   cannot work there. Get a free Postgres database before deploying:
   - Easiest: inside the Vercel project (step 2) open the **Storage** tab →
     **Create Database** → **Neon (Postgres)** → Connect. Vercel injects the
     connection string as an env var automatically.
   - Or create one directly at [neon.tech](https://neon.tech) (free tier) and
     copy its connection string.
2. **Import the project**: on [vercel.com](https://vercel.com), **Add New →
   Project → Import Git Repository**, choose
   `hafiz-adeel-eng/Quranlyhub-seo-system`, and set the branch to
   `claude/pakistan-rishta-platform-7cycmv` (Project Settings → Git →
   Production Branch, if you want it on your main `.vercel.app` domain).
3. **Environment variables** (Project Settings → Environment Variables):
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | the Postgres connection string from step 1 |
   | `NEXTAUTH_SECRET` | a random secret — generate with `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | your Vercel URL, e.g. `https://your-project.vercel.app` |
   | `NEXT_PUBLIC_SITE_URL` | same as `NEXTAUTH_URL` |
   | `ADMIN_EMAILS` | your email — the only account allowed to open `/admin/unlocks` |
   | `MANUAL_PAYMENT_NUMBER` | your JazzCash/Easypaisa number for receiving payments |
   | `MANUAL_PAYMENT_NAME` | the name shown alongside that number |
4. **Deploy**. Vercel runs `npm run build`, which runs `prisma generate`
   automatically (see `package.json`'s `build` script).
5. **Create the schema and seed data** — from anywhere with the
   `DATABASE_URL` from step 1:
   ```bash
   DATABASE_URL="<paste-it>" npx prisma db push
   DATABASE_URL="<paste-it>" npm run db:seed
   ```
   (If you'd rather not run this yourself, share the connection string and
   this can be done for you.)

After that, the `.vercel.app` URL is a fully working, publicly reachable copy
of the site — real signups, real profiles, real per-city pages.

## Beyond the first deploy

1. **Payments**: wire up JazzCash/Easypaisa or Stripe as described above.
2. **Photos**: `Profile.photoUrl` exists in the schema but the upload flow
   isn't built yet — plug in any object storage (S3, Cloudflare R2,
   Uploadthing) and add an upload step to the profile form.
3. **Moderation**: `Profile.isVerified` and `isPublished` flags exist for a
   future admin review queue (block spam/fake profiles before they go live
   on a city page) — currently every profile publishes immediately.
