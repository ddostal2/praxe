# ADR-001: Context API vs Redux pro stav košíku

**Datum:** 2026-05-22
**Stav:** Schváleno
**Rozhodli:** tým projektu

## Kontext

Eshop potřebuje sdílený stav košíku (položky, množství, součet) napříč několika komponentami a stránkami. Musíme zvolit způsob správy tohoto stavu ve frontendu (`client/`) bez zbytečné složitosti pro rozsah školního / malého projektu.

## Rozhodnutí

Pro stav košíku použijeme **React Context API** s vlastním `CartContext` a hookem (např. `useCart`) v adresáři `client/src/context/`. Redux ani Redux Toolkit do projektu nezavádíme.

## Důvody

- Košík je jediná výrazně sdílená doména stavu — nepotřebujeme globální store pro desítky sliceů
- Context API je součástí Reactu, bez dalších závislostí a konfigurace (store, providery, middleware)
- Pro jednoduchý eshop stačí několik akcí (přidat, odebrat, změnit množství, vyčistit) — implementace v jednom contextu je přehledná
- Tým už má zkušenost s Context API z cvičení (např. `ThemeContext`)

## Zvážené alternativy

- **Redux / Redux Toolkit** — výkonný ekosystém pro velké aplikace s komplexním stavem, DevTools a předvídatelným flow; pro náš scope by přinesl boilerplate (store, slice, typy akcí) bez reálného přínosu
- **Lokální stav + prop drilling** — jednoduché na začátku, ale u košíku na více stránkách rychle nepřehledné a špatně udržovatelné

## Důsledky

**Pozitivní:**
- + Rychlejší start, méně souborů a konceptů k naučení
- + Menší `bundle` — žádná knihovna navíc
- + Stav košíku držíme na jednom místě (`context/CartContext.js`)

**Negativní / cena:**
- - Při častých aktualizacích velkého contextu hrozí zbytečné re-rendery — řešíme rozdělením contextů nebo `useMemo` / selektivními consumery
- - Pokud projekt poroste (objednávky, uživatel, filtry, admin), může být potřeba přehodnotit a zavést Redux nebo jiný state manager (nové ADR)

## AI input

*Cursor Agent při dokumentaci rozhodnutí potvrdil Context API pro malý eshop. **Souhlasíme** — scope odpovídá jednoduchému košíku, ne enterprise aplikaci, na kterou AI často doporučuje Redux Toolkit.*
