# JS FUNDAMENTALS

## Const / Let
- Klíčová slova v JavaScriptu sloužící k vytváření proměnných
- Používají blokový rozsah { }
### const
- Používá se pro hodnoty, které se v průběhu programu nebudou měnit
- Proměnnou nelze znovu přiřadit, ale u objektů a polí lze měnit jejich vnitřní data (přidávat/ubírat prvky v poli, měnit vlastnosti objektu)
- Musí mít počáteční hodnotu
### let
- Používá se pro proměnné, jejichž hodnota se v budoucnu bude měnit (cykly, počítadla)

## Arrow funkce
- Šipkové funkce jsou moderní, stručnější způsob zápisu funkcí v JavaScriptu.
- Šetří kód a řeší časté problémy s hodnotou klíčového slova this
- **Klasická funkce se zapisuje takto:**
    ```javascript
    function secti(a,b){
    return a+b;  
  };
    ```
- **Zápis arrow funkcí:**
    ```javascript
    const secti = (a,b) => {
    return a + b;  
  };
    ```
- **Zkrácený zápis arrow funkcí - obsahuje pouze jeden příkaz:**
    ```javascript
  //Více parametrů
    const secti = (a,b) => a + b;
  //1 parametr
    const druhaMocnina = cislo => cislo * cislo;
  //bez parametrů
    const pozdrav = () => "Ahoj!";
    ```
## Destructing funkce
- Umožňuje snadno vybalit hodnoty z polí nebo vlastnosti z objektů a uložit je do samostatných proměnných v jednom přehledném řádku kódu.
- **Tradiční způsob:**
    ```javascript
    const uzivatel = { jmeno: 'Jan', vek: 17, mesto: 'Ostrava'};
  
    const jmeno = uzivatel.jmeno;
    const vek = uzivatel.vek;
    ```
- **Destructing:**
    ```javascript
    const uzivatel = { jmeno: 'Jan', vek: 17, mesto: 'Ostrava'};

    const { jmeno, vek } = uzivatel;
    console.log(jmeno);
  
  //Přejmenování proměnných
    const { jmeno: krestniJmeno } = uzivatel;
    console.log(krestniJmeno);
    ```
## Spread funkce
- Spread syntax (tzv. spread operátor, zapsaný jako ...) v JavaScriptu umožňuje rozbalit iterovatelný objekt (např. pole nebo řetězec) na jednotlivé prvky. Běžně se používá pro kopírování, slučování nebo předávání argumentů do funkcí.
    ```javascript
    const barvy = ['Červená', 'Zelená'];
    const RGB = [...barvy, 'Modrá']; // ['Červená', 'Zelená', 'Modrá']
  
    const puvodniPole = [1, 2, 3]; // [1, 2, 3]
    const kopiePole = [...puvodniPole];
  
  const cisla = [5, 12, 9];
  const maximum = Math.max(...cisla); // Ekvivalentní zápisu Math.max(5, 12, 9)
    ```
## Funkce .map
- Funkce .map() v JavaScriptu je vestavěná metoda polí (Array), která vytváří nové pole. Aplikuje zadanou funkci na každý prvek původního pole, aniž by původní pole jakkoliv měnila
    ```javascript
    const cisla = [4, 9, 16, 25];
    const novePole = cisla.map(Math.sqrt) // [2,3,4,5]

  
    const cisla = [1, 2, 3, 4, 5];
    // Map vezme každé číslo a vynásobí ho dvěma
    const zdvojnasobenaCisla = cisla.map(cislo => cislo * 2);

    console.log(zdvojnasobenaCisla); // [2, 4, 6, 8, 10]
    console.log(cisla);              // [1, 2, 3, 4, 5] (Původní pole se nezměnilo)
  
  
    const uzivatele = [
  { jmeno: "Jan", primeni: "Novák" },
  { jmeno: "Petr", primeni: "Svoboda" },
  { jmeno: "Anna", primeni: "Černá" }
    ];
    
    // Spojíme jméno a příjmení do jednoho řetězce
    const celaJmena = uzivatele.map(uzivatel => `${uzivatel.jmeno} ${uzivatel.primeni}`);
    
    console.log(celaJmena); // Výstup: ["Jan Novák", "Petr Svoboda", "Anna Černá"]
    ```
  
## Funkce .filter
- Funkce filter() v JavaScriptu vytváří nové pole obsahující pouze ty prvky z původního pole, které splňují zadanou podmínku.
  - Metoda prochází postupně každý prvek a volá na něj testovací (callback) funkci. Pokud funkce vrátí true, prvek se přidá do nového pole. Pokud vrátí false, prvek se vynechá.
      ```javascript
    const uzivatele = [
    { jméno: 'Anna', vek: 17 },
    { jméno: 'Petr', vek: 25 },
    { jméno: 'Jana', vek: 19 }
    ];
    
    // Vyfiltruje uživatele starší nebo rovno 18 let
    PlnoletiUzivatele = uzivatele.filter(uzivatel => uzivatel.vek >= 18);
    
    console.log(PlnoletiUzivatele);
    // Vypíše: [ { jméno: 'Petr', vek: 25 }, { jméno: 'Jana', vek: 19 } ]
    ```

## Funkce .reduce
- Funkce reduce() v JavaScriptu slouží k redukci (zpracování) pole na jedinou výstupní hodnotu (např. součet čísel, seskupení objektů nebo vytvoření nového řetězce). Prochází postupně všemi prvky pole a drží si průběžný mezivýsledek (akumulátor).
    ```javascript
        pole.reduce((akumulator, aktualniPrvek) => {
          // operace a vrácení nového mezivýsledku
        }, pocatecniHodnota);
    ```
    ```javascript
    const cisla = [10, 20, 30, 40];

    const soucet = cisla.reduce((akumulator, aktualniPrvek) => {
    return akumulator + aktualniPrvek;
    }, 0); // 0 je počáteční hodnota akumulátoru
    
    console.log(soucet); // Výstup: 100

    //Arrow funkce
    const soucet = cisla.reduce((suma, cislo) => suma + cislo, 0);
    ```
  
## Funkce .find
- Metoda find() v JavaScriptu vyhledá a vrátí první prvek v poli, který splňuje zadanou podmínku. Pokud žádný takový prvek nenajde, vrátí hodnotu undefined.
    ```javascript
    const cisla = [5, 8, 12, 19, 4];
    const nalezeno = cisla.find(cislo => cislo > 10);
    
    console.log(nalezeno); // Výstup: 12
    ```

## Async / Await
- Konstrukce async a await slouží k asynchronnímu programování. Umožňuje vašemu programu provádět náročné operace (např. stahování dat, čtení souboru) na pozadí, aniž by se zablokovalo hlavní vlákno a aplikace "zamrzla".
- **async:** Klíčové slovo, kterým označíte funkci. Říká tím překladači, že funkce bude vracet příslib (tzv. Promise nebo Task) a že uvnitř ní budete moci používat operátor await.
- **await:** Příkaz, který „pozastaví“ provádění asynchronní funkce do doby, než se dokončí operace na pozadí (např. než dorazí odpověď ze serveru). Během čekání systém uvolní vlákno pro jinou práci.

```javascript
async function nactiData() {
    try {
        // Await zastaví kód zde, ale hlavní vlákno běží dál
        const odpoved = await fetch('https://example.com');
        
        // Zde čekáme na převedení na JSON
        const data = await odpoved.json(); 
        return data;
    } catch (error) {
        console.error('Chyba:', error);
    }
}
```

## Try / Catch
- Konstrukce try...catch v JavaScriptu slouží k ošetření chyb (výjimek). Umožňuje vám spustit kód, který by mohl selhat, a pokud se tak stane, program nespadne, ale chybu elegantně zachytí a zpracuje.
- **Struktura se skládá ze dvou (případně tří) hlavních bloků:**
```javascript
try {
  // Kód, který chceme spustit a může vyhodit chybu
} catch (error) {
  // Kód, který se spustí POUZE v případě, že v bloku try nastala chyba
  // Proměnná 'error' obsahuje detaily o chybě
} finally {
  // (Nepovinné) Kód, který se spustí VŽDY, bez ohledu na to, zda chyba nastala nebo ne
}

//Příklad

console.log("Začátek programu");

try {
    neexistujiciFunkce(); // Tady skočíme rovnou do bloku catch
    console.log("Tento řádek se v try už neprovede");
} catch (error) {
    console.error("Aha, něco se pokazilo: " + error.message);
}
```
