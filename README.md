# BOOKLY — Neo-Brutalist Bookstore Demo

A playful, fully client-side bookstore demo built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and the **BoldKit** neubrutalism component registry (shadcn-style). No backend, no images — every cover, illustration, avatar, and background is generated (SVG + canvas).

## Stack

- **Next.js 16.3.1** (App Router, Turbopack) + **React 19.2** + **TypeScript**
- **Tailwind CSS v4** with a customized BoldKit theme (yellow / blue / pink / lime palette, thick `border-3` borders, hard offset shadows)
- **BoldKit registry components** — installed via `npx shadcn@latest add "https://boldkit.dev/r/<name>.json"` into `src/components/ui/`
- **Recharts** (profile charts), **multiavatar** (deterministic SVG avatars), **sonner** (toasts)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo account: **yousseif@bookly.demo** (any password) — or click **TRY DEMO ACCOUNT** on the login/form pages / profile gate.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server (Turbopack)     |
| `npm run build`   | Production build + type check        |
| `npm run start`   | Serve the production build           |
| `npm run lint`    | ESLint (React Compiler rules)        |

## Routes

| Route               | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `/`                 | Home — hero, marquee, featured, categories, sale     |
| `/products`         | Catalog with search, category + discount filters     |
| `/product/[id]`     | Product page — cover variants, stock, reviews        |
| `/categories`       | Browse all 10 categories                             |
| `/login` / `/register` | Auth (localStorage accounts, demo Google)         |
| `/me`               | Profile — orders, wishlist, reading stats, journal   |

## Features

- **27 books / 10 categories** in `src/data/books.ts` — prices, discounts, stock, bestseller/new/featured flags, deterministic generated reviews
- **Generative covers** — `BookCover` renders a unique SVG cover per book (seeded patterns, 3 variants per book)
- **Theme toggle** — light / dark / system, persisted (`bookly-theme`); dark mode keeps bright offset shadows
- **Cart drawer** — quantities, totals, localStorage persistence (`bookly-cart`)
- **Wishlist** + **auth** (register/login/logout, editable profile) — localStorage stores
- **Profile reading stats** — category-mix donut + monthly-reads bar chart (BoldKit charts, demo data)
- **Order journey timeline** — each order card has a **SHOW ORDER JOURNEY** toggle with a BoldKit timeline (placed → processing → shipped → delivered)
- **Multiavatar avatars** — in the navbar, profile header, and every review

## Decorative Layer

All decor is `aria-hidden`, `pointer-events-none`, and CSS-transform/SVG-based for performance:

- `Topography` — animated contour-map canvas background (BoldKit `canvas-effects/Topography`, `#8ecae6` lines, hero)
- `TypographyCanvas` — huge rotated poster words behind hero / auth / profile
- `HaikeiBlob` — organic blob shapes in the brand palette (catmull-rom generated)
- `shapes` — 55 BoldKit SVGs (stars, splats, scribble underlines, zigzag banners, …) with float/wiggle/spin animations
- `HandDrawnArrow` — squiggle arrows pointing at CTAs
- Hand-rolled neo-brutalist people + book-stack illustrations
- `Reveal` — one-shot viewport reveal (transforms/opacity, respects cleanup)

## Implementation Notes

- **Hydration-safe localStorage stores** — `src/providers/store-providers.tsx` uses `useSyncExternalStore` with a proper `getServerSnapshot` (the SSR-time initial value); React swaps to the localStorage snapshot after hydration, so server HTML and client first render always match.
- **React 19.2 / Next 16**: modules that use hooks and are imported by server components must opt in with `'use client'` (applied to BoldKit's `use-theme.tsx`, `sonner.tsx`, and `canvas-effects/Topography.tsx`).
- **Next 16 async params**: `params`/`searchParams` are async (`await` before use) — see `/product/[id]` and `/products`.
- **lint**: `npm run lint` is clean except for two warnings in vendored BoldKit files (`ui/empty-state.tsx` alt-text, `ui/shapes.tsx` unused prop).

## Structure

```
src/
├── app/                  # routes (pages + layout, fonts, providers, toaster)
├── components/
│   ├── auth/             # login / register forms
│   ├── book/             # BookCover, BookCard, BookGrid
│   ├── cart/             # cart drawer, quantity stepper
│   ├── decor/            # blobs, arrows, typography canvas, illustrations, avatar, reveal
│   ├── home/             # hero, featured, categories, sale section
│   ├── navbar/           # sticky nav — search, theme, cart, account
│   ├── product/          # product detail, reviews
│   ├── profile/          # profile page, orders, stats, timeline
│   └── ui/               # vendored BoldKit components (button, card, shapes,
│                         #   chart, donut-chart, timeline, topography, …)
├── data/books.ts         # books, categories, reviews
├── hooks/use-theme.tsx   # theme store (localStorage)
├── lib/                  # types, utils
├── providers/            # store providers (auth, cart, wishlist)
└── styles/               # BoldKit theme + app extras
```