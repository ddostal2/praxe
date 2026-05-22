---
description: Stavy načítání, chyb a async fetch ve FE i BE
globs: "{client/**,server/**,**/components/**,**/pages/**,**/services/**,**/hooks/**}/*.{js,jsx}"
alwaysApply: false
---

# Loading a chybové stavy

## Frontend — povinný vzor pro data z API

Každá komponenta/hook načítající data musí řešit **tři stavy**: `loading`, `error`, `data` (úspěch).

### Doporučené stavy (oddělené boolean + data)

```jsx
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null); // string | null
```

### Alternativa: jeden stavový řetězec

```jsx
// "loading" | "loaded" | "error"
const [state, setState] = useState("loading");
```

Použít jeden styl v rámci celého modulu — nemíchat oba přístupy v jedné aplikaci.

## Fetch v `useEffect`

1. Na začátku požadavku: `setLoading(true)`, `setError(null)`.
2. Kontrola `response.ok`; při selhání `throw new Error("…")` s **českou** zprávou.
3. `AbortController` + cleanup při unmount — ignorovat `AbortError`.
4. V `finally`: `setLoading(false)` jen pokud request nebyl abortnut.

```jsx
useEffect(() => {
  const controller = new AbortController();

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("Nepodařilo se načíst data.");
      setProducts(await res.json());
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Došlo k chybě při načítání dat.");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  load();
  return () => controller.abort();
}, []);
```

## Podmíněné vykreslení (pořadí)

1. **Loading** — skeleton nebo `<p>Načítám data…</p>`
2. **Error** — srozumitelná česká hláška, bez stack trace
3. **Data** — hlavní UI

```jsx
if (loading) return <p>Načítám data…</p>;
if (error) return <p>Chyba: {error}</p>;
return (/* seznam / detail */);
```

## UX pravidla

- Loading text v češtině; u delších operací zvážit skeleton místo holého textu.
- Chybu zobrazit uživateli; technické detaily jen do `console.error` v dev.
- Tlačítko „Zkusit znovu“ u kritických obrazovek (reset stavu + opakování fetch).
- Prázdný úspěšný výsledek (`[]`) ≠ chyba — zobrazit „Žádné položky“, ne error.

## Backend — odpovědi a chyby

| HTTP | Kdy | Tělo (camelCase JSON) |
|------|-----|------------------------|
| 200 | OK | `{ data: … }` nebo přímo objekt dle konvence endpointu |
| 400 | Neplatný vstup | `{ error: "Popis chyby", code: "VALIDATION_ERROR" }` |
| 404 | Nenalezeno | `{ error: "Produkt nenalezen", code: "NOT_FOUND" }` |
| 500 | Neočekávaná chyba | `{ error: "Interní chyba serveru" }` — bez stacku ven |

- Všechny chybové zprávy v `error` poli **česky** (pro FE zobrazení).
- Logovat detail na serveru (`console.error`), klientovi poslat obecnou zprávu u 500.

## Služba `services/*.js` (FE)

```js
// productService.js — vrací data nebo hodí Error s českou zprávou
export async function fetchProducts(signal) {
  const res = await fetch("/api/products", { signal });
  if (!res.ok) throw new Error("Nepodařilo se načíst produkty.");
  return res.json();
}
```

Komponenta pak jen volá službu a spravuje `loading` / `error`.
