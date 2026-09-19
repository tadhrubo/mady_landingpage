# Mady Shawarma

An animation-led restaurant website for Mady, a Chittagong shawarma shop with a bold red and yellow identity.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `PORT=5001 BASE_PATH=/ pnpm --filter @workspace/mady-shawarma run build` — production build check

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mady-shawarma/src/App.tsx` — routes, shared shell, interactions, and scroll sequence
- `artifacts/mady-shawarma/src/content/site.ts` — editable brand, contact, area, ingredient, and menu configuration
- `artifacts/mady-shawarma/src/index.css` — Mady visual tokens, responsive layout, and motion fallback styles
- `artifacts/mady-shawarma/public/brand/` — supplied logo and reference image
- `artifacts/mady-shawarma/public/ingredients/` — local flat SVG placeholders for replaceable ingredient and area art

## Architecture decisions

- The site is a frontend-only artifact with client-side route handling because the brief only requires client-side contact validation and no backend order flow.
- GSAP ScrollTrigger owns the reversible build-the-wrap timeline; Lenis drives smooth scrolling and forwards scroll updates to ScrollTrigger.
- All brand art stays local, with CSS/SVG placeholders kept behind editable paths so real cutouts can replace them without page changes.
- Reduced-motion users receive readable static content with the pinned scrub sequence disabled.

## Product

- Home page with preloader, hero, story sections, marquee, chips, pinned wrap-building sequence, takeaway areas, CTA, and footer.
- Inside the Wrap page with ingredient path storytelling and stacking ingredient cards.
- Menu page with all requested categories, prices in ৳, filter tabs, and local wrap art.
- Contact page with editable contact details, WhatsApp CTA, client-side validation, and illustrated map placeholder.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The Vite artifact build expects `PORT` and `BASE_PATH`; the managed workflow supplies them automatically.
- `ScrollTrigger.getAll().length` is logged on the client during the home page build sequence setup.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
