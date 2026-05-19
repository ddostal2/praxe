/*
  ═══════════════════════════════════════════════════════════════
  CO TENHLE SOUBOR VŮBEC DĚLÁ? (přečti si to jako první)
  ═══════════════════════════════════════════════════════════════

  Představ si e-shop. Máš:
  - KATALOG = seznam všech produktů (načte se ze souboru products.json)
  - 4 ÚKOLY (funkce), které s katalogem pracují:
      1) ukázat jen produkty z jedné kategorie (třeba jen knihy)
      2) seřadit produkty podle ceny od nejlevnějšího / nejdražšího
      3) najít ten jeden nejdražší produkt
      4) spočítat, kolik stojí věci v košíku

  JavaScript soubor = návod pro počítač, řádek po řádku.
  Počítač čte shora dolů (jako recept v kuchařce).

  Po spuštění se tě program zeptá v konzoli:
  - jakou kategorii chceš
  - jestli ceny asc (od nejlevnějšího) nebo desc (od nejdražšího)
*/

// ─── ČÁST 0: NAČTENÍ DAT ZE SOUBORU ─────────────────────────────
//
// require("fs") = „půjč si nástroje na práci se soubory na disku“
// readFileSync = přečti soubor HNED a počkej, dokud není načtený
//   (sync = synchronní = zastav se a čekej – pro začátek je to jednodušší na pochopení)
const { readFileSync } = require("fs");

// require("path") = nástroje na skládání cest k souborům
// join = slep cestu správně (Windows používá \, jiné systémy / – join to vyřeší za tebe)
const { join } = require("path");

// __dirname = „ve které složce leží TENHLE .js soubor“
//   (u tebe: .../matyas/)
//
// join(__dirname, "../../data/products.json") znamená:
//   z matyas/ jdi o dvě složky nahoru (../..) → jsi v 02/
//   pak vejdi do data/ a otevři products.json
//
// readFileSync(..., "utf8") přečte soubor jako text (písmena, čísla v souboru)
// JSON.parse(...) ten text přemění na JavaScript data:
//   - v JSON je „pole“ [ ... ] = seznam věcí za sebou (jako seznam nákupů)
//   - každá věc v seznamu je „objekt“ { } = kartička s údaji (název, cena, id…)
//
// Výsledek uložíme do proměnné produkty – to je náš KATALOG (pole objektů).
const produkty = JSON.parse(
    readFileSync(join(__dirname, "../../data/products.json"), "utf8")
);

// ─── FUNKCE 1: JEN JEDNA KATEGORIE ───────────────────────────────
//
// function = vytvoříš si vlastní „příkaz“ s názvem, který můžeš volat znovu a znovu.
// filterByCategory(products, category) dostane:
//   products = seznam produktů (katalog nebo jeho část)
//   category = text, např. "books" (knihy)
//
// Příklad z života: máš regál se vším zbožím → chceš jen knihy → ostatní vyhodíš z výpisu.
function filterByCategory(products, category) {
    // .filter() projde celý seznam produktů jeden po druhém.
    // U každého se zeptá: „patříš do té kategorie?“
    //   product.category === category  → porovnání: je kategorie stejná jako hledám?
    //     === znamená „jsou úplně stejné“ (i typ – proto "books", ne books bez uvozovek)
    // Pokud ANO → produkt zůstane v NOVÉM seznamu, který filter vrátí.
    // Pokud NE → do nového seznamu se nedostane.
    // return = „hotovo, tady máš výsledek“ a funkce končí.
    return products.filter((product) => product.category === category);
}

// ─── FUNKCE 2: SEŘADIT PODLE CENY ────────────────────────────────
//
// sortByPrice(products, direction)
//   direction = "asc" (ascending = vzestupně = od nejlevnějšího)
//            nebo "desc" (descending = sestupně = od nejdražšího)
function sortByPrice(products, direction) {
    // Uživatel může napsat "ASC" nebo "Desc" – převedeme na malá písmena, ať to vždy sedí.
    const dir = String(direction).toLowerCase();

    // factor je násobitel, který říká, jestli řadíme „normálně“ nebo „opačně“:
    //   desc → factor = -1  (vynásobení -1 u porovnání cen otočí pořadí)
    //   cokoliv jiného → factor = 1 (klasické řazení od nejlevnějšího)
    //
    // Zápis  podmínka ? hodnotaKdyžAno : hodnotaKdyžNe  je zkratka pro if/else na jeden řádek.
    const factor = dir === "desc" ? -1 : 1;

    // [...products] = udělej KOPII seznamu (trojtečky = „rozbal obsah pole do nového pole“)
    // Proč kopie? Protože .sort() mění pořadí PŘÍMO v poli – nechceme rozhodit původní katalog.
    //
    // .sort() potřebuje funkci, která porovná DVA produkty najednou (a a b):
    //   a.price - b.price = rozdíl cen
    //     kladné číslo → a je dražší → a má jít za b
    //     záporné číslo → a je levnější → a má jít před b
    //   * factor = když factor -1, pořadí se obrátí → od nejdražšího
    return [...products].sort((a, b) => (a.price - b.price) * factor);
}

// ─── FUNKCE 3: NEJDRAŽŠÍ PRODUKT ─────────────────────────────────
//
// findMostExpensive(products) → vrátí JEDNU kartičku produktu (objekt), ne cenu jako číslo.
function findMostExpensive(products) {
    // products.length = kolik položek je v seznamu
    // Když je 0, není co hledat → vrátíme undefined (= „nic jsme nenašli“)
    if (!products.length) return undefined;

    // .reduce() = projdi seznam a postupně z něj udělej JEDNU hodnotu.
    //
    // Představ si soutěž: držíš v ruce „zatím nejlepšího“ (best).
    // Ke každému dalšímu produktu se ptáš: je dražší než ten v ruce?
    //   ano → hoď starého, vezmi nového
    //   ne → nech toho v ruce
    //
    // (best, product) => ...  je šipková funkce = krátký zápis „pro každý product udělej...“
    // product.price > best.price ? product : best
    //   = když je nový dražší, vrať nový, jinak nech starého vítěze
    return products.reduce((best, product) =>
        product.price > best.price ? product : best
    );
}

// ─── FUNKCE 4: CENA KOŠÍKU ───────────────────────────────────────
//
// cartTotal(cartItems, products)
//   cartItems = co má zákazník v košíku, např. [ { id: 2 }, { id: 5 } ]
//               (často jen id produktu + kolik kusů)
//   products = celý katalog (aby šlo podle id zjistit cenu)
//
// Problém: v košíku je jen id (číslo 2), ne celá kartička s cenou.
// Řešení: nejdřív si z katalogu uděláme „telefonní seznam“ id → produkt.
function cartTotal(cartItems, products) {
    // Map = speciální seznam typu „podle čísla id hned najdu produkt“
    //   .get(2) → hned vrátí produkt s id 2 (nemusíš procházet celý katalog pokaždé)
    //
    // products.map(...) = z každého produktu udělej dvojici [id, produkt]
    // new Map(...) z těch dvojic postav ten rychlý seznam.
    const byId = new Map(products.map((p) => [p.id, p]));

    // Teď projdeme košík a sčítáme ceny.
    // reduce začíná na sum = 0 (zatím jsme nic nepřičetli).
    // U každé položky v košíku:
    return cartItems.reduce((sum, item) => {
        // item.id ?? item.productId
        //   ?? znamená: „vezmi id, a když chybí (null/undefined), zkus productId“
        const product = byId.get(item.id ?? item.productId);

        // Když id v katalogu není (překlep, smazaný produkt), přeskoč – nic nepřičítáme.
        if (!product) return sum;

        // Kolik kusů? Někdo napíše quantity, někdo qty, někdo nic → pak bereme 1 kus.
        const qty = Number(item.quantity ?? item.qty ?? 1);

        // Přičti: cena jednoho kusu × počet kusů
        // return nového sum = reduce si to pamatuje na další položku košíku
        return sum + product.price * qty;
    }, 0); // 0 na konci = „začni počítat od nuly korun“
}

// ─── POMOCNÉ: VŠECHNY KATEGORIE Z KATALOGU ─────────────────────────
//
// Z produktů vytáhne jen unikátní názvy kategorií (bez opakování).
// Set = „sáček“, kam dáváš věci a duplicity ignoruje.
function getAllCategories(products) {
    const categories = new Set();
    for (const product of products) {
        categories.add(product.category);
    }
    return [...categories].sort();
}

// ─── POMOCNÉ: DOTAZ V KONZOLI (vestavěný modul readline) ───────────
const readline = require("readline");

// Zeptá se uživatele v konzoli a počká, až napíše odpověď a zmáčkne Enter.
function askQuestion(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
}

// Ukázkový košík (id produktů z products.json)
const cartItems = [
    { id: 2 }, // mechanická klávesnice
    { id: 5 }, // kniha Clean Code
];

// Převede odpověď uživatele na "asc" nebo "desc" (bere i češtinu a čísla 1/2)
function normalizeDirection(input) {
    const s = String(input).toLowerCase().trim();
    if (["asc", "a", "1", "vzestupne", "vzestupně", "nahoru"].includes(s)) {
        return "asc";
    }
    if (["desc", "d", "2", "sestupne", "sestupně", "dolu"].includes(s)) {
        return "desc";
    }
    return "";
}

// Vypíše seřazené produkty přehledně pod sebe (číslovaný seznam)
function vypisSerazeneProdukty(nadpis, produktySeznam) {
    console.log("");
    console.log("----------------------------------------");
    console.log(nadpis);
    console.log("----------------------------------------");

    if (produktySeznam.length === 0) {
        console.log("  (zadne produkty v teto kategorii)");
        return;
    }

    produktySeznam.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.title} - ${p.price} Kc`);
    });

    const ceny = produktySeznam.map((p) => p.price);
    console.log("  Ceny v poradi: " + ceny.join(", "));
}

// Vypíše košík a celkovou cenu
function vypisKosik(kosik, katalog) {
    console.log("\n=== Košík ===");
    const byId = new Map(katalog.map((p) => [p.id, p]));
    kosik.forEach((polozka) => {
        const produkt = byId.get(polozka.id);
        if (produkt) {
            const qty = polozka.quantity ?? polozka.qty ?? 1;
            console.log(`  - ${produkt.title} × ${qty} = ${produkt.price * qty} Kč`);
        }
    });
    console.log(`  CELKEM: ${cartTotal(kosik, katalog)} Kč`);
}

// ─── ČÁST 5: PROGRAM (interaktivní nebo s výchozími hodnotami) ─────
//
// Ve WebStormu tlačítko Run často NEPŘIJÍMÁ psaní z klávesnice.
// Pak použijeme výchozí kategorii "books" a řazení "asc".
// Spolehlivější: spusť v terminálu (node funkce-produkty.js).
async function main() {
    const categories = getAllCategories(produkty);

    console.log("\n=== Kategorie v katalogu ===");
    categories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat}`);
    });

    let category = "";
    let direction = "";
    let rl = null;

    const lzePsatDoKonzole = process.stdin.isTTY === true;

    if (lzePsatDoKonzole) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        while (!categories.includes(category)) {
            const answer = await askQuestion(
                rl,
                "\nZadej cislo (1-" +
                    categories.length +
                    ') nebo nazev kategorie (napr. books): '
            );

            const asNumber = Number(answer);
            if (asNumber >= 1 && asNumber <= categories.length) {
                category = categories[asNumber - 1];
            } else {
                category = answer.toLowerCase();
            }

            if (!categories.includes(category)) {
                console.log("Neplatna volba. Zkus znovu.\n");
            }
        }

        while (!direction) {
            const answer = await askQuestion(
                rl,
                "Razeni: 1 nebo asc = od nejlevnejsiho, 2 nebo desc = od nejdrazsiho: "
            );
            direction = normalizeDirection(answer);
            if (!direction) {
                console.log('Napis "1", "2", "asc" nebo "desc".\n');
            }
        }
    } else {
        category = "books";
        direction = "asc";
        console.log(
            "\n(Poznamka: spoustis z IDE bez interaktivni konzole - vychozi: books, asc.)"
        );
        console.log(
            "Pro vlastni volbu spust v terminalu: node funkce-produkty.js\n"
        );
    }

    const filtered = filterByCategory(produkty, category);
    const sorted = sortByPrice(filtered, direction);

    const smerText =
        direction === "asc"
            ? "od nejlevnejsiho (asc)"
            : "od nejdrazsiho (desc)";

    vypisSerazeneProdukty(
        `SERAZENE PRODUKTY [kategorie: ${category}, razeni: ${smerText}]`,
        sorted
    );

    if (sorted.length > 0) {
        const nejdrazsi = findMostExpensive(sorted);
        console.log(
            `Nejdrazsi v kategorii "${category}": ${nejdrazsi.title} (${nejdrazsi.price} Kc)`
        );
    }

    vypisKosik(cartItems, produkty);

    if (rl) {
        rl.close();
    }
}

main().catch((err) => {
    console.error("Chyba programu:", err.message);
});
