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
