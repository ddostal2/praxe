# AI Fails Log

## Fail #1: Nesoulad mezi JSON daty a SQL schématem
* **Datum:** 22. 5. 2026
* **Popis:** AI vytvořila podle SQL schéma data ([products.json](file:///c:/Users/User/Documents/GitHub/praxe/praxe/projekt/server/src/db/products.json)), která neseděla v názvech sloupců (`title` vs. `name`, `image` vs. `image_url`)
* **Ponaučení:** AI nehlídá konzistenci dat napříč vrstvami (JSON vs. DB).

## Fail 2: JavaScript a CSS pro Dark mode (s localStorage + prefers-color-scheme):
* **Prompt**
* Zkontroluj localStorage. Pokud tam volba není, použij prefers-color-scheme. 
* Třídu dark aplikuj na <html> přímo v <head>, aby se zabránilo probliknutí barvy při načtení. 
* Vytvoř přepínací tlačítko, které mění motiv a ukládá volbu do localStorage. 
* Připrav CSS pro světlý a tmavý režim, (CSS světlý řežim už má)
* Používej pravidla pro psaní čistého a efektivního kódu : C:\Users\User\Documents\GitHub\praxe\praxe\projekt\.cursor
* **Popis**
* Nekontrastní a nečitelný text: Přepínání sice funguje a pozadí zčerná, ale text zůstal tmavý, takže splývá s černým pozadím a spatně se dá přečíst.
* Rozbitý hover u kategorií: U výběru kategorií funguje efekt po najetí myší (:hover) špatně, protože barva pozadí kompletně překryje text.
* Neviditelné logo: Logo projektu má tmavé barvy, takže po přepnutí do tmavého režimu na černém pozadí úplně zaniklo a není vůbec vidět.
* **Ponaučení**
* Samotná funkční logika (JavaScript) nestačí. Při implementaci Dark Mode je vždy nutné předhodit AI stávající CSS strukturu (nebo aspoň barvy, selektory menu a loga). Jinak AI generuje styly naslepo a výsledkem je sice funkční přepínač, ale vizuálně rozbitý web.