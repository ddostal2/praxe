---
description: Struktura adresářů frontendu a backendu
alwaysApply: true
---

# Struktura projektu

## Kořen repozitáře (doporučený monorepo layout)

```
project/
├── client/                 # frontend (React + Vite nebo CRA)
├── server/                 # backend (Node + Express)
├── docs/                   # dokumentace, ADR
└── .cursor/rules/          # pravidla pro AI
```

## Frontend (`client/`)

```
client/
├── public/
├── src/
│   ├── main.jsx            # vstupní bod
│   ├── App.jsx
│   ├── index.css
│   ├── components/         # sdílené UI komponenty
│   │   └── product-list/
│   │       ├── ProductList.jsx
│   │       └── ProductList.css
│   ├── pages/              # routované stránky (PascalCase soubor)
│   │   ├── HomePage.jsx
│   │   └── UserDetailPage.jsx
│   ├── hooks/              # vlastní hooky (camelCase soubor)
│   │   └── useProducts.js
│   ├── services/           # volání API (fetch wrappery)
│   │   └── productService.js
│   ├── context/            # React context
│   │   └── ThemeContext.js
│   └── utils/              # čisté funkce bez Reactu
│       └── formatPrice.js
├── package.json
└── vite.config.js
```

**Pravidla FE:**

- Komponenta = vlastní složka jen pokud má CSS nebo více souborů; jinak přímo v `components/`.
- Stránky v `pages/`, znovupoužitelné kusy v `components/`.
- Veškeré HTTP volání přes `services/`, ne přímo v JSX uvnitř hlubokého stromu (výjimka: jednoduché demo s jedním `useEffect`).

## Backend (`server/`)

```
server/
├── src/
│   ├── index.js            # spuštění serveru
│   ├── app.js              # Express app, middleware
│   ├── routes/             # definice rout (kebab-case v URL)
│   │   ├── products.js
│   │   └── users.js
│   ├── controllers/        # obsluha requestů
│   │   └── productController.js
│   ├── services/           # business logika
│   │   └── productService.js
│   ├── middleware/         # error handler, auth, …
│   │   └── errorHandler.js
│   └── data/               # JSON / mock / DB adaptéry
│       └── products.json
├── package.json
└── .env.example
```

**Pravidla BE:**

- Routy pouze mapují URL → controller; logika v `services/`.
- Jeden router soubor na doménu (`products.js`, `users.js`).
- Centrální `errorHandler` middleware — ne duplikovat try/catch v každé routě bez důvodu.

## Importy

- Relativní importy v rámci `src/` (`../services/productService.js`).
- Žádné importy z `client/` do `server/` ani naopak.
