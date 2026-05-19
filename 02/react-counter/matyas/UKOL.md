# React intro – Counter (WebStorm untitled1)

Úkol podle [react.dev – Quick Start](https://react.dev/learn) a [State: paměť komponenty](https://react.dev/learn/state-a-components-memory).

## Soubory

| Soubor | Účel |
|--------|------|
| `src/Counter.js` | **Hlavní úkol** – komponenta Counter |
| `src/App.js` | Zobrazí Counter na stránce |
| `src/index.js` | Vstupní bod (Create React App) |

## Spuštění

V terminálu ve složce projektu:

```bash
cd C:\Users\User\WebstormProjects\untitled1
npm start
```

Prohlížeč se otevře na http://localhost:3000

**Nepoužívej** dvojklik na `public/index.html` – u Reactu vždy `npm start`.

## Pravidlo cvičení

Counter piš **ručně** – bez Cursor Tab / AI autocomplete.

## Co má Counter umět

1. `import { useState } from "react"`
2. `const [count, setCount] = useState(0)`
3. Tlačítko s `onClick`, které zvýší `count`
4. Zobrazení aktuální hodnoty `{count}`

## Rozšíření (volitelné)

Přidej druhé tlačítko `−` a `setCount(count - 1)`.
