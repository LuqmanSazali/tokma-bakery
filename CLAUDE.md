# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tokma Bakery** — a static bakery website for a home-based bakery in the **Kajang, Malaysia** area. Built with **Vite + React 18 + TypeScript + Tailwind CSS**, deployed to **GitHub Pages** via GitHub Actions. All logic runs client-side only — no backend, no database.

**Design priority: mobile-first.** Most customers browse on phones. All layouts, tap targets, and interactions are designed for mobile screens first, then scaled up for desktop.

**Design style: colorful & fun.** Warm, cheerful, bright colors — not corporate or minimal.

## Tech Stack

- **Vite + React 18 + TypeScript** — frontend framework & build tool
- **Tailwind CSS** — utility-first styling, mobile-first breakpoints
- **Leaflet.js + react-leaflet** — interactive map for delivery zone/distance calculation
- **localStorage** — persist customer info (name, phone, address) between visits
- **WhatsApp `wa.me/` deep link** — checkout sends a pre-filled order message to `+60176259747`
- **GitHub Actions** — auto-build and deploy `/dist` to GitHub Pages on push to `main`

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:5173)
npm run build      # Type-check + build for production → /dist
npm run preview    # Preview production build locally
npm run typecheck  # Run tsc without emitting (type check only)
```

## File Structure

```
src/
  main.tsx
  App.tsx                   # Root component, page routing
  types/
    index.ts                # Shared TypeScript interfaces
  data/
    products.ts             # ← EDIT THIS to add/remove products
  components/
    Navbar.tsx
    ProductCard.tsx
    Cart.tsx
    CheckoutForm.tsx
    DeliveryMap.tsx         # Leaflet map + zone/fee logic
  pages/
    Home.tsx
    CartPage.tsx
    CheckoutPage.tsx
  hooks/
    useCart.ts
    useCustomer.ts
  utils/
    whatsapp.ts
    delivery.ts
  styles/
    index.css               # Tailwind directives + custom CSS variables
public/
  images/
.github/
  workflows/
    deploy.yml
```

## Key Types (`src/types/index.ts`)

```ts
interface Product {
  id: string
  name: string
  price: number        // MYR
  image: string
  description: string
  category: 'cake' | 'bread' | 'pastry' | 'cookies'
}

interface CartItem {
  product: Product
  quantity: number
}

interface Customer {
  name: string
  phone: string
  address: string
}

interface DeliveryResult {
  distanceKm: number
  fee: number
  zone: 'standard' | 'extended' | 'unavailable'
}
```

## Adding New Products

Edit `src/data/products.ts` — exports `PRODUCTS: Product[]`. After editing, commit and push to `main`.

## Mobile-First Guidelines

- Tailwind mobile-first: base classes = mobile, `sm:` / `md:` / `lg:` = larger screens
- Minimum tap target: **44×44px** — use `min-h-[44px] min-w-[44px]` on buttons
- Product grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Bottom-fixed cart bar on mobile: `fixed bottom-0 left-0 right-0`
- Leaflet map: `h-[300px] md:h-[450px]`

## Delivery Logic

- Baker base: fixed Kajang coordinate in `delivery.ts`
- Distance: Haversine formula
- ≤ 5 km → standard fee (`distance × RATE_PER_KM`)
- 5–15 km → increased fee + warning
- \> 15 km → blocks checkout, shows alert
- Update `RATE_PER_KM` in `delivery.ts` when petrol price changes

## WhatsApp Checkout Flow

1. Customer fills name, phone, address → saved to `localStorage`
2. Pins location on map → delivery fee shown
3. Clicks **Order via WhatsApp** or **Buy Now**
4. Opens `https://wa.me/60176259747?text=<encoded message>`
5. Message: item list, quantities, prices, subtotal, delivery fee, total, name, address

## localStorage Keys

| Key | Value |
|-----|-------|
| `tokma_customer_name` | string |
| `tokma_customer_phone` | string |
| `tokma_customer_address` | string |

## GitHub Pages Deployment

- Push to `main` → GitHub Actions runs `npm ci && npm run build` → deploys `/dist` to `gh-pages` branch
- Repo Settings → Pages → source: `gh-pages` branch, `/ (root)`
- `vite.config.ts` base must match repo name: `base: '/tokma-bakery/'`
