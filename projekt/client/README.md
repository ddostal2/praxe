# Praxe — frontend (`client/`)

React aplikace postavená na **Vite** s **react-router-dom**. Struktura a konvence odpovídají `.cursor/rules/` v kořeni projektu.

## Spuštění

```bash
cd client
npm install
npm run dev
```

Vývojový server běží typicky na [http://localhost:5173](http://localhost:5173). Požadavky na `/api` se proxyují na `http://localhost:3000` (viz `vite.config.js`).

## Struktura `src/`

| Složka        | Účel                                  |
|---------------|---------------------------------------|
| `pages/`      | Routované stránky (`HomePage.jsx`, …) |
| `components/` | Znovupoužitelné UI (např. `layout/`)  |
| `services/`   | Volání REST API (`/api/…`)            |
| `hooks/`      | Vlastní hooky                         |
| `context/`    | React context (např. košík)           |
| `utils/`      | Čisté utility bez Reactu              |
| `constants/`  | Sdílené konstanty (`API_BASE`)        |

## Skripty

- `npm run dev` — vývoj
- `npm run build` — produkční build do `dist/`
- `npm run preview` — náhled buildu
- `npm run lint` — ESLint
