# 🧇 Barn Waffles — บ้าน Waffles Smart Dashboard

A full-stack café management dashboard built with Next.js 14, Firebase, Tailwind CSS, shadcn/ui, Framer Motion, and Recharts.

## Firebase Setup

Your Firebase config is already saved in `.env.local`. Before running:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → your `barn-waffles` project
2. Enable **Authentication** → Sign-in method → **Email/Password** + **Google**
3. Enable **Firestore Database** → Start in production mode → region `asia-southeast1`
4. In Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Storefront (Landing Page)

The public page at `/` is a customer-facing storefront — menu, ordering on LINE,
and visiting details — not a pitch for the POS. Everything shop-specific lives in
two files:

| File | Holds |
|---|---|
| `src/components/landing/site.ts` | Shop name, phone, LINE ID, address, hours, menu items and photos |
| `src/components/landing/copy.ts` | All English and Thai copy |

Shop details ship blank on purpose (`lineId`, `address`, `hours`). While blank, the
page degrades instead of breaking: the order tray copies the order and opens LINE
instead of deep-linking a chat, and the Visit card drops the address and directions
rows. Fill in `site.ts` to switch the real behaviour on.

## Features

| Feature | Description |
|---|---|
| 📊 Dashboard | Sales KPIs, line/bar/pie charts, best sellers, peak hours |
| 🧮 Calculator | Cost breakdown + profit margin calculator, save to Firestore |
| 🧇 Menu | Add/edit/delete waffle menus with image URLs, category filter |
| 📦 Inventory | Stock tracking, low-stock alerts, supplier & expiry info |
| 🛒 POS | Order creation, QR payment display, receipt modal, order history |

## Project Structure

```
src/
  app/
    (auth)/login, register      ← Public auth pages
    (dashboard)/
      dashboard/                ← Analytics page
      calculator/               ← Profit calculator
      menu/                     ← Menu management
      inventory/                ← Inventory tracking
      orders/                   ← POS + order history
  components/
    dashboard/                  ← KPI cards, Sidebar
    ui/                         ← shadcn/ui primitives
  firebase/
    config.ts                   ← Firebase init
    auth.ts                     ← Auth helpers
    firestore.ts                ← Firestore CRUD + listeners
  hooks/
    useAuth.tsx                 ← Auth context
  types/
    index.ts                    ← TypeScript types
```
