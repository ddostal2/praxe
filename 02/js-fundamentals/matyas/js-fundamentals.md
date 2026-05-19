# JS fundamentals

## cons/let
- **Co to je:** Jsou to proměnné do kterých ukládám nějaké údaje. Rozdíl mezi let a const je takový:  
**let:** Je proměnná ve které zadaný údaj můžu  průběhu měnit.  
**const:** Je proměnná ve které zadaný zadaný údaj v průběhu programu nikdy nemůžu změnit. To co do ní vpíšu na začátku v ní zůstane až do konce.
- **Příklad:**  
  ```javascript
  const jmenoHrace = "nejlepsiHrac"; // Tohle zůstane navždy stejné
  let skore = 0;              // Tohle můžu v pohodě změnit

  skore = 10;                 // Tohle funguje, skóre se zvýšilo
  jmenoHrace = "nejhorsiHrac";   // Tohle udělat nemůžu, počítač začne křičet
  ```

## Arrow funkce
- **Co to je:** Je to zkrácený zápis pro definování funkcí v JavaScriptu pomocí operátoru =>.  
- **Proč se používají:** Zkracují zápis a zpřehledňují kód. Při zápisu se nevyužívají ani složené závorky a ani return.
-  **Příklad:**
   ```javascript
    // Klasická funkce
    function vynasob(a, b) {
    return a * b;
    }

    // Arrow funkce 
    const vynasobArrow = (a, b) => a * b;  
   ```
   
## Destructuring
- **Co to je:** Destrukturalizace je syntaxe která nám umožňuje extrahovat hodnoty z polí nebo z objektů do proměnných.
- **Proč se používá:** Používá se když chce pracovat s daty uvnitř objektu a nechcepe k nim pořád přistupovat přes tečkovou notaci (např. objekt.nazev).  
- **Příklad:**
  ```javascript
    const produkt = {nazev: "Notebook", cena: 20000 };

    // Bez destrukturalizace: 
    const nazev = produkt.nazev; 
    const cena = produkt.cena;
    // S destrukturalizací:
    const { nazev, cena } = produkt;

    console.log(nazev); // Vypíše: Notebook
  ```

## Spread operátor ...
- **Co to je:** Vezme všechny jednotlivé prvky z nějakého pole a překopíruje je někam jinam (např. do nového pole).
- **Proč se používá:** Používá se pro kopii polí a objektů, spojování více polí do jednoho nebo přidávání nových prvků do existujících struktur bez změny původního pole nebo objektu.
- **Příklad:**
    ```javascript
    const pole1 = [1, 2, 3];
    // Vytvoříme nové pole, do kterého vložíme prvky z pole1 a přidáme číslo 4
    const pole2 = [...pole1, 4];

    console.log(pole2); // Vypíše: [1, 2, 3, 4]
  ```

## map/filter/reduce/find
- **Co to je:** Jsou to vestavěné funkce určené k efektivní práci s daty v polích.

**map:** Projde celé pole, na každý prvek aplikuje zadanou funkci a vrátí nové pole.
**Příklad:**
```javascript
const cisla = [1, 2, 3];
const naDruhou = cisla.map(x => x * x); // [1, 4, 9]
```
**filter:** Projde celé pole a na každý prvek použije zadanou podmínku. Vytvoří nové pole a vloží do něj ty prvky které podmínku splňují.  
**Příklad:**
```javascript
const veky = [12, 25, 17, 30];
const dospeli = veky.filter(vek => vek >= 18); // [25, 30]
```
**find:** Projde celé pole a vratí jenom jeden prvek, který splňuje danou podmínku. Pokud žádný prvek podmínku nesplňuje, vrátí undefined.  
**Využití:** Vyhledávání konkretního záznamu (např. ID).  
**Příklad:**
```javascript
const uzivatele = [{id: 1, jmeno: "A"}, {id: 2, jmeno: "B"}];
const nalezeny = uzivatele.find(u => u.id === 2); // {id: 2, jmeno: "B"}
```
**reduce:** Projede celé pole a aplikuje funkci, která všechny prvky zkombinuje do jedné výsledné hodnoty.  
**Příklad:** 
```javascript
const hodnoty = [10, 20, 30];
const celkem = hodnoty.reduce((suma, x) => suma + x, 0); // 60
```

## async/await
- **Co to je:** Je to syntatická struktura prozápis asynchronního kódu. Asynchronní kó je kód u kterého čekáme na dokončení nějaké operace a mezitím zbytek programu běží dál. 

**async:** Určuje že funkce vrací objekt typu Promise a že uvnitř ní jde použít slovo await.  
**await:** Zastaví vykonávání funkce na konkrétním řádku, dokud se asynchronní operace nevyřeší.

- **Proč se používá:** Umožňuje psát asynchronní kód stejně jako synchronní.
- **Příklad:** 
```javascript
async function nactiData() {
  // Kód se zde zastaví a počká, než se data z URL stáhnou
  const odpoved = await fetch("URL");
  const data = await odpoved.json();
  return data;
}
```

## try/catch
- **Co to je:** Je to konstrukce sloužící k ošetření chyb v programu.  

**try:** Obsahuje kód ve kterém mohlo dojít k chybě.
**catch:** Spusti se jen tehdy když v bloku try nastala nějaká chyba.

- **Proč se používá:** Zabraňuje tomu aby celá aplikace spadla v připadě že nastala v programu nějaká chyba.
- **Příklad:**  
```javascript
try {
  // Pokus o spuštění neexistující funkce vyvolá chybu
  spustFunkciKteraNeexistuje(); 
} catch (chyba) {
  // Program nespadne, kód skočí sem a vypíše informaci o chybě
  console.log("Nastala chyba v programu: " + chyba.message);
}
```
