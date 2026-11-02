# Ideating Labs

React storefront with a Cloudflare Worker API and a D1-backed product catalog.

## Local development

```sh
npm install
npm run dev
```

The Cloudflare Vite plugin serves the SPA, product images, and `/api/*` routes
from the same local origin. During development, product API requests are
proxied through `https://ideatinglabs.com` to the deployed Worker. Production
and localhost therefore read the same `ideating-labs-products` D1 database,
making Cloudflare the catalog's single source of truth.

The catalog API is currently read-only. If write endpoints are added later,
local requests will modify production data and should be protected before use.

## Supabase authentication

Copy `.env.example` to `.env.local` and add the browser-safe credentials from
the existing Supabase project:

```sh
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Never put a Supabase secret or service-role key in a `VITE_` variable. These
values are bundled into the browser application. Add the same two variables to
the Cloudflare GitHub build environment for production builds.

In Supabase, keep email/password authentication and email confirmation enabled.
Under Auth URL Configuration, set the production site URL to
`https://ideatinglabs.com` and allow these redirect URLs:

- `https://ideatinglabs.com/auth/callback`
- `http://127.0.0.1:5173/auth/callback`

Supabase's default email service is suitable for development testing only.
Configure custom SMTP before production launch.

## Product API

- `GET /api/products`
- `GET /api/products?category=Outerwear`
- `GET /api/products/:slug`

Catalog schema and seed data live in `migrations/`.

## Stripe Checkout

Checkout uses Stripe test mode, with the Cloudflare Worker as the only trusted
payment backend. The Worker calculates totals from D1, creates Stripe-hosted
Checkout Sessions, and records paid orders only after receiving a verified
Stripe webhook.

Add these secrets to the local `.dev.vars` file and to the deployed
`ideating-labs` Worker. Never use `VITE_` variables for Stripe secrets:

```sh
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
```

Register this production Stripe webhook endpoint:

```text
https://ideatinglabs.com/api/payments/stripe/webhook
```

Subscribe it to `checkout.session.completed`,
`checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, `checkout.session.expired`, and
`charge.refunded`. Enable Stripe Tax, configure the applicable Canadian tax
registrations and apparel tax codes, and enable Stripe receipt emails before
accepting live payments.

## Checks

```sh
npm run lint
npm run build
npm run deploy:dry-run
```

## Create and deploy the production database

Sign in to the intended Cloudflare account before creating remote resources:

```sh
npx cf auth login
npx cf d1 create --name ideating-labs-products --dry-run
npx cf d1 create --name ideating-labs-products
```

Save the returned database ID in `cloudflare.config.ts` and the remote migration
script. Then migrate and deploy:

```sh
npm run db:migrate:remote
npm run deploy
```
