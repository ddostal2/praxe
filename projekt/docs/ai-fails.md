# AI Fails Log

## Fail #1: Nesoulad mezi JSON daty a SQL schématem
* **Datum:** 22. 5. 2026
* **Popis:** AI vytvořila podle SQL schéma data ([products.json](file:///c:/Users/User/Documents/GitHub/praxe/praxe/projekt/server/src/db/products.json)), která neseděla v názvech sloupců (`title` vs. `name`, `image` vs. `image_url`)
* **Ponaučení:** AI nehlídá konzistenci dat napříč vrstvami (JSON vs. DB).
