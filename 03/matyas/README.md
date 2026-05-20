# React cvičení – 03/matyas

Tato složka obsahuje kompletní samostatný React projekt postavený na **Vite** a **TypeScriptu**, který řeší a integruje tři praktická cvičení:
1. **useEffect cvičení** – asynchronní načítání produktů s AbortControllerem.
2. **useContext cvičení** – globální Theme Switcher (light/dark režim) bez localStorage.
3. **Mini Routing App cvičení** – směrování stránek přes `react-router-dom` s dynamickými parametry.

---

## Jak projekt spustit

1. Otevřete terminál a přejděte do této složky:
   ```bash
   cd praxe/03/matyas
   ```
2. Pokud ještě nemáte nainstalované závislosti, spusťte:
   ```bash
   npm install
   ```
3. Spusťte vývojový server:
   ```bash
   npm run dev
   ```
4. Otevřete v prohlížeči zobrazenou adresu (obvykle `http://localhost:5173`).

---

## Rozcestník a struktura souborů

Všechny soubory obsahují detailní české komentáře vysvětlující každý řádek kódu.

- **[src/ThemeContext.tsx](file:///c:/Users/User/Documents/GitHub/praxe/praxe/03/matyas/src/ThemeContext.tsx)**: Globální kontext pro přepínání témat (`light` / `dark`) pomocí hooků `createContext` a `useContext`.
- **[src/components/Navbar.tsx](file:///c:/Users/User/Documents/GitHub/praxe/praxe/03/matyas/src/components/Navbar.tsx)**: Navigační panel, který používá `Link` z `react-router-dom` (vysvětluje rozdíl oproti `<a>`) a zobrazuje rychlý přepínač témat.
- **[src/pages/Home.tsx](file:///c:/Users/User/Documents/GitHub/praxe/praxe/03/matyas/src/pages/Home.tsx)**: Hlavní stránka (cesta `/`), obsahuje velký přepínač témat a vyhledávací políčko, které používá `useNavigate` k přesměrování na profil uživatele.
- **[src/pages/About.tsx](file:///c:/Users/User/Documents/GitHub/praxe/praxe/03/matyas/src/pages/About.tsx)**: Statická stránka (cesta `/about`), která reaguje na zvolené téma.
- **[src/pages/UserDetail.tsx](file:///c:/Users/User/Documents/GitHub/praxe/praxe/03/matyas/src/pages/UserDetail.tsx)**: Dynamická stránka (cesta `/user/:id`), která pomocí hooku `useParams` načítá a zobrazuje parametr `id` z URL.
- **[src/ProductList.tsx](file:///c:/Users/User/Documents/GitHub/praxe/praxe/03/matyas/src/src/ProductList.tsx)**: Stránka produktů (cesta `/products`) z prvního cvičení, která demonstruje bezpečné asynchronní načítání s `AbortControllerem`.
- **[src/App.tsx](file:///c:/Users/User/Documents/GitHub/praxe/praxe/03/matyas/src/App.tsx)**: Hlavní obalová komponenta integrující `BrowserRouter`, `Routes`, `Route` a `ThemeProvider`.

---

## Technické koncepty podrobně

### 1. Theme Switcher přes `useContext`
Kontext nám umožňuje sdílet data o vybraném tématu napříč celou aplikací, aniž bychom museli propustit téma přes každou komponentu (prop-drilling).
*   **`createContext`**: Vytvoří kontejner pro data.
*   **`ThemeProvider`**: Komponenta, která obaluje aplikaci a předává objekt `{ theme, toggleTheme }` do vnitřku aplikace.
*   **`useTheme`**: Vlastní hook, který interně volá `useContext(ThemeContext)` a bezpečně vrací data o tématu. Kdykoliv se téma přepne, všechny komponenty využívající `useTheme` se okamžitě re-renderují.

### 2. Mini Routing App (`react-router-dom`)
Umožňuje vytvořit tzv. **Single Page Application (SPA)**, kde se mění URL v adresním řádku, ale prohlížeč se neznovu načítá celý.
*   **`BrowserRouter`**: Obaluje celou aplikaci a napojuje se na HTML5 History API v prohlížeči.
*   **`Routes` a `Route`**: `Routes` funguje jako switch a vybírá první vyhovující `Route` (např. `/user/:id`).
*   **`Link` vs `<a>`**: Klasický tag `<a>` vyvolá úplný reload stránky a ztrátu React stavu. Komponenta `Link` změní pouze URL a React Router překreslí pouze vnitřní komponenty.
*   **`useParams()`**: Získá parametry z URL (v našem případě `id` z `/user/:id`).
*   **`useNavigate()`**: Umožňuje přesměrovat uživatele na jinou stránku z programového kódu (např. po kliknutí na tlačítko nebo odeslání formuláře).

---

## Vysvětlení pro Tech Leada (TL): Co se stane, když vynecháme dependency array v `useEffect`?

V Reactu určuje pole závislostí (dependency array – druhý argument hooku `useEffect`), **kdy** se má efekt znovu spustit. 

Pokud pole závislostí **vynecháme úplně** (např. `useEffect(() => { ... })`), chování se zásadně liší od předání prázdného pole `[]` nebo pole s proměnnými `[dep1, dep2]`.

### 1. Spouštění při každém renderu (Render Loop)
Bez pole závislostí se efekt spustí po **úplně každém překreslení (renderu)** komponenty. To znamená:
- Spustí se při prvním připojení (mount).
- Spustí se pokaždé, když se změní jakýkoliv stav (`state`), `props`, nebo kontext (`context`) v této komponentě.

### 2. Riziko nekonečné smyčky (Infinite Loop)
Pokud uvnitř takového `useEffect` aktualizujeme stav komponenty (např. voláním `setProducts` nebo `setLoading`), nastane následující řetězec událostí:
1. Komponenta se renderuje.
2. Spustí se `useEffect` (protože chybí pole závislostí).
3. Efekt zavolá `setProducts(data)` (změna stavu).
4. Změna stavu vynutí nový render komponenty.
5. Po tomto novém renderu se opět spustí `useEffect` (opět chybí pole závislostí).
6. Efekt znovu aktualizuje stav...
7. **Výsledek:** Nekonečná smyčka překreslování, která zahltí prohlížeč i API server (dojde k tisícům HTTP požadavků za sekundu), dokud aplikace nespadne.

---

### Srovnání tří variant použití `useEffect`

| Varianta zápisu | Kdy se efekt spustí? | Vhodné použití | Rizika / Poznámky |
| :--- | :--- | :--- | :--- |
| **`useEffect(() => {})`**<br>*(Bez pole závislostí)* | Po **každém** renderu komponenty. | Velmi zřídka (např. globální logování, měření výkonu renderu). | **Vysoké riziko nekonečné smyčky** při změně stavu uvnitř efektu. Zbytečná režie. |
| **`useEffect(() => {}, [])`**<br>*(Prázdné pole)* | Pouze **jednou** po prvním připojení (mount). | Načítání dat při startu, inicializace externích knihoven, event listenery. | Pokud efekt čte stav nebo props, může pracovat se zastaralými hodnotami (*stale closures*). |
| **`useEffect(() => {}, [a, b])`**<br>*(Se závislostmi)* | Po mountu a následně při **jakékoliv změně** hodnot `a` nebo `b`. | Reakce na změnu ID v URL, vyhledávacího filtru, stránkování. | Všechny proměnné použité uvnitř efektu musí být v poli závislostí uvedeny (ESLint pravidlo `react-hooks/exhaustive-deps`). |
