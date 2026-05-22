# ADR-003: Express + better-sqlite3 vs Express + JSON soubor

**Datum:** 2026-05-22
**Stav:** Schváleno
**Rozhodli:** tým projektu

## Kontext

Backend v `server/` musí persistovat data produktů (a případně objednávek / uživatelů). Potřebujeme zvolit úložiště mezi jednoduchým čtením/zápisem JSON souboru a lehkou relační databází přístupnou z Node.js bez samostatného DB serveru.

## Rozhodnutí

Backend stavíme na **Express** s perzistencí přes **better-sqlite3** (souborová SQLite databáze). Čisté řešení „Express + jeden JSON soubor“ jako primární úložiště nepoužíváme.

## Důvody

- SQLite přes **better-sqlite3** je synchronní a jednoduchá na lokální vývoj — žádný Docker ani PostgreSQL pro školní scope
- **Dotazy a transakce** (INSERT/UPDATE/SELECT) jsou spolehlivější než ruční merge celého JSON při každé změně
- Menší riziko **poškození dat** při souběžných zápisech než u přepisování jednoho velkého JSON souboru
- Datová vrstva v `server/src/data/` může obalit DB přístup; routy a controllery zůstávají stejné jako v `project-structure.md`

## Zvážené alternativy

- **Express + JSON soubor** (`products.json`) — nejrychlejší na prototyp a čtení mock dat; při zápisech z API (objednávka, sklad) hrozí race conditions, chybí indexy a validace na úrovni DB bez vlastní logiky
- **Express + PostgreSQL/MySQL** — vhodné pro produkci a větší tým; pro lokální eshop a jednoduché nasazení zbytečná provozní náročnost

## Důsledky

**Pozitivní:**
- + Reálnější model než čistý JSON — blíž běžné praxi malých aplikací
- + Jednoduché zálohy (kopie `.sqlite` souboru)
- + Možnost později přidat migrace nebo ORM bez změny architektury Express

**Negativní / cena:**
- - Nutnost definovat schéma tabulek a inicializační skript / seed
- - SQLite má limity pro vysokou souběžnost zápisů — při růstu trafficu by bylo potřeba nové ADR (např. PostgreSQL)
- - JSON mock může zůstat jen pro testy nebo jednorázový import dat

## AI input

*Cursor při návrhu ADR doporučil better-sqlite3 pro malý Express backend. **Souhlasíme** — JSON stačí na čtení ukázkových produktů, ale eshop s objednávkami potřebuje spolehlivější perzistenci než přepis jednoho souboru.*
