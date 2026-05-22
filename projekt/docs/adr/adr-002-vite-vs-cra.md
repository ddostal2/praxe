# ADR-002: Vite vs Create React App pro FE bootstrap

**Datum:** 2026-05-22
**Stav:** Schváleno
**Rozhodli:** tým projektu

## Kontext

Potřebujeme nástroj pro sestavení a vývoj React aplikace v `client/`. CRA byl dlouho standard, ale vývoj okolo něj zpomalil; Vite je dnes běžná volba pro nové projekty s rychlejším dev serverem a aktivní údržbou.

## Rozhodnutí

Frontend bootstrapujeme pomocí **Vite** (React šablona). Create React App (CRA) nepoužíváme.

## Důvody

- **CRA je v praxi zastaralé** — oficiální dokumentace doporučuje migraci na moderní nástroje; nové projekty se na CRA nespoléhají
- Vite nabízí **rychlý HMR** a krátký cold start dev serveru (nativní ESM)
- Jednoduchá konfigurace (`vite.config.js`), v souladu se strukturou v `project-structure.md`
- Konzistence s ostatními cvičeními v repozitáři (např. Vite + TypeScript u kolegů)

## Zvážené alternativy

- **Create React App (CRA)** — známé z starších materiálů a cvičení, ale pomalší dev experience, těžší customizace bez ejectu a bez jasné budoucnosti pro greenfield projekty
- **Next.js** — vhodné pro SSR/SSG a fullstack routing; pro statický / jednoduchý eshop s vlastním Express BE by bylo zbytečně těžké

## Důsledky

**Pozitivní:**
- + Rychlejší iterace při vývoji UI a košíku
- + Aktuální stack odpovídající praxi v roce 2026
- + Snadné rozšíření proxy na API v `vite.config.js` při lokálním vývoji

**Negativní / cena:**
- - CRA-specific materiály z kurzu je třeba přeložit na Vite (`index.html` v rootu `client/`, `main.jsx` jako entry)
- - Pokud by projekt vyžadoval složitou webpack konfiguraci z legacy světa, museli bychom řešit Vite pluginy (u našeho scope nečekáme)

## AI input

*Při plánování projektu Cursor doporučil Vite místo CRA. **Souhlasíme** — CRA není vhodná výchozí volba pro nový repozitář; Vite pokrývá naše potřeby bez přidané složitosti.*
