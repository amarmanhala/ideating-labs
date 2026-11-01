# Ideating Labs

React storefront with a Cloudflare Worker API and a D1-backed product catalog.

## Local development

```sh
npm install
npm run dev
```

The Cloudflare Vite plugin serves the SPA, product images, and `/api/*` routes
from the same local origin. Its D1 binding connects to the production
`ideating-labs-products` database, making Cloudflare the catalog's single
source of truth during local and deployed development.

The catalog API is currently read-only. If write endpoints are added later,
local requests will modify production data and should be protected before use.

## Product API

- `GET /api/products`
- `GET /api/products?category=Outerwear`
- `GET /api/products/:slug`

Catalog schema and seed data live in `migrations/`.

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
