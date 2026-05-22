---
description: Základní konvence kódu — JS, komentáře, pojmenování, exporty
alwaysApply: true
---

# Základní konvence programování

## Jazyk a technologie

- **Pouze JavaScript** — soubory `.js` / `.jsx`. Nepoužívat TypeScript (`.ts`, `.tsx`, `tsconfig`, typové anotace).
- **Komentáře a dokumentace v češtině** — JSDoc bloky, inline komentáře, chybové hlášky pro uživatele, texty v UI.
- Angličtina jen pro identifikátory v kódu (názvy proměnných, funkcí, souborů komponent), pokud není uvedeno jinak.

## Pojmenování

| Co | Konvence | Příklad |
|----|----------|---------|
| React komponenty (soubor + export) | PascalCase | `ProductList.jsx` → `ProductList` |
| Složky komponent | kebab-case | `star-rating-component/` |
| Hooky | camelCase, prefix `use` | `useProducts.js` |
| Utility / služby | camelCase | `formatPrice.js` |
| Konstanty | UPPER_SNAKE_CASE | `PRODUCTS_API_URL` |

## Exporty — jeden export na soubor

- Každý soubor exportuje **právě jednu** věc (komponentu, hook, utilitu).
- Preferovat **default export** u komponent; named export jen u barrel souborů (`index.js`), pokud je to výslovně potřeba.

```jsx
// ✅ ProductList.jsx
const ProductList = () => { /* ... */ };
export default ProductList;

// ❌ více exportů v jednom souboru
export const ProductList = () => {};
export const ProductCard = () => {};
```

## Komentáře (česky)

- Každá veřejná komponenta má JSDoc s `@component` a `@returns`.
- Složitá logika (fetch, abort, side effects) má krátký český komentář **proč**, ne co dělá každý řádek.
- Nepřekládat názvy API polí v komentářích — držet `productId`, `createdAt` (camelCase z API).

```jsx
/**
 * Komponenta ProductList.
 * Načte produkty z API a zobrazí loading / chybový stav.
 * @component
 * @returns {JSX.Element}
 */
```

## React — obecně

- Funkční komponenty + hooky (žádné class komponenty).
- PropTypes pro veřejné komponenty s props (bez TS).
- Soubor komponenty: stejný název jako komponenta (`ProductList.jsx`).
