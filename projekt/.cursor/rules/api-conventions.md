---
description: Konvence REST API — URL, JSON, prefix /api
globs: "{server/**,client/**/services/**}/*.{js,jsx}"
alwaysApply: false
---

# API konvence

## Prefix a verze

- Všechny endpointy začínají **`/api/`** (např. `/api/products`, `/api/users/42`).
- Volitelná verze: `/api/v1/products` — po zavedění verze držet konzistentně.

## URL — kebab-case, REST

| Operace | Metoda | URL příklad |
|---------|--------|-------------|
| Seznam | GET | `/api/products` |
| Detail | GET | `/api/products/:id` |
| Vytvoření | POST | `/api/products` |
| Úprava | PUT/PATCH | `/api/products/:id` |
| Smazání | DELETE | `/api/products/:id` |
| Vnořený zdroj | GET | `/api/users/:userId/orders` |

**Pravidla URL:**

- **kebab-case** v path segmentech (`/api/order-items`, ne `orderItems`).
- Množné číslo u kolekcí (`products`, `users`).
- ID v path jako `:id` / `:productId` (camelCase u parametru v kódu Express).

## JSON — camelCase

Tělo requestu i response používá **camelCase** klíče:

```json
{
  "productId": 1,
  "title": "Tričko",
  "createdAt": "2026-05-22T10:00:00Z",
  "isActive": true
}
```

- ❌ `product_id`, `created_at` (snake_case) v JSON API
- Pole pole: `orderItems`, ne `order_items`

## Standardní tvary odpovědí

**Seznam:**

```json
{
  "items": [ { "productId": 1, "title": "…" } ],
  "total": 42
}
```

**Detail / mutace úspěch:**

```json
{
  "productId": 1,
  "title": "Tričko",
  "price": 19.99
}
```

**Chyba:**

```json
{
  "error": "Produkt nenalezen",
  "code": "NOT_FOUND"
}
```

## Frontend — volání API

- Base URL konstanta: `const API_BASE = "/api";` nebo env `VITE_API_URL`.
- Cesty skládat jako `` `${API_BASE}/products` `` → `/api/products`.
- Proxy ve Vite: `/api` → `http://localhost:3000` (server).

```js
// ✅
await fetch("/api/products");
await fetch(`/api/products/${productId}`);

// ❌
await fetch("/products");           // chybí prefix
await fetch("/api/product_list");   // snake_case v URL
```

## Backend — Express (ukázka)

```js
// routes/products.js
router.get("/", listProducts);           // GET /api/products
router.get("/:id", getProduct);          // GET /api/products/:id
router.post("/", createProduct);

// app.js
app.use("/api/products", productsRouter);
```

## Query parametry

- camelCase: `?sortBy=price&pageSize=20`
- Boolean jako `true`/`false` string nebo `1`/`0` — jeden styl v celém API

## Co nedělat

- Nemíchat kebab-case URL se snake_case JSON.
- Nepoužívat `.ts` typy pro request/response — dokumentovat JSDoc v `.js`.
- Neexponovat interní stack trace v JSON odpovědi.
