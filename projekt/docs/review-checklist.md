# Checklist pro review AI-generovaného kódu

Tento dokument slouží pro revizi (review) kódu vygenerovaného pomocí AI (např. GitHub Copilot, Cursor Composer, ChatGPT). Před sloučením jakéhokoliv Pull Requestu nebo dokončení úkolu musí kód projít touto kontrolou.

## 1. Funkčnost a správnost (Correctness)
- [ ] **Skutečný běh:** Spustil jsem kód lokálně a otestoval jeho reálné chování (nejen "statické" review)?
- [ ] **Edge cases:** Ošetřuje kód hraniční stavy (např. prázdné pole produktů, neexistující ID, speciální znaky, prázdný košík)?
- [ ] **Chybové stavy:** Jsou všechny asynchronní operace a síťové požadavky obaleny v try/catch bloku? Zobrazí se uživateli srozumitelná chybová zpráva?
- [ ] **Validace vstupů:** Jsou vstupy od uživatele (např. kontaktní formulář, objednávka) validovány na frontendu i backendu?

## 2. Halucinace a AI specifika
- [ ] **Neexistující knihovny/API:** Nepoužívá AI smyšlené metody nebo knihovny, které v projektu nejsou nainstalované?
- [ ] **Mrtvý kód (Dead code):** Neobsahuje kód zbytečné komentáře typu `// TODO: implement`, prázdné funkce nebo nevyužité proměnné?
- [ ] **Správný kontext:** Odpovídá kód naší stávající architektuře (např. better-sqlite3 synchronní zápisy, DB schéma) a nepoužívá vzory z jiných databází?
- [ ] **Konzistentní data:** Sedí názvy polí z databáze a API (camelCase v JSON, snake_case v SQL)?

## 3. React specifika (Frontend)
- [ ] **Unikátní klíče (keys):** Mají všechny prvky generované v cyklu (`.map`) unikátní a stabilní prop `key`?
- [ ] **Cleanup v useEffect:** Obsahují asynchronní operace v `useEffect` správný cleanup (např. `AbortController` pro zrušení síťového požadavku při unmountu komponenty)?
- [ ] **Prop drilling / Stav košíku:** Je stav košíku řešen pomocí `CartContext` a ne zbytečným předáváním props skrz mnoho úrovní?
- [ ] **Zbytečné re-rendery:** Jsou drahé výpočty nebo závislosti v useEffect/useMemo správně ošetřeny?
- [ ] **TypeScript typování:** Jsou všechny komponenty a props otypované? Je striktně zakázáno používat typ `any`?

## 4. Čitelnost a konvence
- [ ] **Jazyk komentářů:** Jsou veškeré inline komentáře, JSDoc a uživatelské hlášky psány **česky**?
- [ ] **Pojmenování komponent:** Jsou React komponenty pojmenovány v `PascalCase` a soubory odpovídají názvu komponenty?
- [ ] **Jeden export:** Obsahuje každý soubor pouze jeden export (komponentu, hook nebo utilitu)?
- [ ] **Endpoint konvence:** Mají API endpointy prefix `/api/`, používají `kebab-case` v URL a vrací `camelCase` JSON?

## 5. Bezpečnost (Security)
- [ ] **SQL Injection:** Jsou všechny SQL dotazy parametrizovány? (Žádné přímé spojování řetězců jako `db.prepare("SELECT * FROM products WHERE id = " + id)`).
- [ ] **XSS (Cross-Site Scripting):** Jsou uživatelské vstupy bezpečně vykreslovány (React standardně escapuje, nepoužívat `dangerouslySetInnerHTML` bez sanitizace)?
- [ ] **Expozice dat:** Neobsahuje backendová chybová odpověď citlivé údaje nebo stack trace?
- [ ] **API klíče a tajemství:** Nejsou v kódu natvrdo zapsané (hardcoded) žádné API klíče, hesla nebo přístupy k DB? Vše musí jít přes `.env`.
