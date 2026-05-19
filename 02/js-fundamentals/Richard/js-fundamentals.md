# JavaScript Fundamentals – stručné vysvětlení
## const
- Deklarace konstanty — hodnotu nelze znovu přiřadit.
  ```javascript
    const name = "Petr";
  
## let
- Deklarace proměnné — hodnotu lze měnit.
```javascript
    let age = 25;
    age = 26;
```
## Arrow funkce
- Zkrácený zápis funkcí pomocí =>. Levá část (const add = (a,b)) je deklarace a pravá část je co vrací nebo
vypíše (a+b).
```javascript
const add = (a, b) => a + b;
```
- To je to samé jako:
```javascript
const add = function(a,b){ 
return a+b;} 
```
## Destructuring 
- Rozbalení hodnot z objektů nebo polí do proměnných.
```javascript
let arr = ["John", "Smith"] 
let [firstName, surname] = arr; 
firstName = arr[0]
surname = arr[1]
alert(firstName); John
alert(surname); Smith
```
## Spread (...)
- Používá se ve volání funkce, když argument je pole. Spread hodnoty pole "rozšíří" do listu parametrů
```javascript        
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5
```
- ,ale
```javascript
let arr = [3, 5, 1];
alert( Math.max(arr) ); /*NaN (Museli bychom vypsat hodnoty pole ( Math.max(arr[0], arr[1], arr[2])), ale
                        nemusíme vědět kolik je prvků v poli)*/
```
## map()
- Deklarace
```javascript
let result = arr.map(function(item, index, array) {
    // returns the new value instead of item
});
```
- Vytvoří nové pole transformací každého prvku.
```javascript
const doubled = [1,2,3].map(n => n * 2);
```
# filter()
- Deklarace
```javascript
let results = arr.filter(function(item, index, array) {
    // if true item is pushed to results and the iteration continues
    // returns empty array if nothing found
});
```
- Vrátí pouze prvky splňující podmínku.
```javascript
const even = [1,2,3,4].filter(n => n % 2 === 0);
```
## reduce()
- Deklarace
```javascript
let value = arr.reduce(function(accumulator, item, index, array) {
    // ...
}, [initial]);
```
- accumulator – je výsledek minulého zavolání funkce, je rovno initial na začátku (pokud je initial zakomponován).
Pokud není initial, tak accumulator má hodnotu prvního prvku pole.
- item - aktuální item v poli
- index - jeho pozice
- Postupně spojí pole do jedné hodnoty.
```javascript
let arr = [1, 2, 3, 4, 5];

let result = arr.reduce((sum, current) => sum + current, 0);

alert(result); // 15
```
## find()
- Deklarace
```javascript
let result = arr.find(function(item, index, array) {
    // if true is returned, item is returned and iteration is stopped          
    // for falsy scenario returns undefined
});
```
- Najde **PRVNÍ** prvek splňující podmínku.
```javascript
const user = users.find(u => u.name === "Eva");
```
## async
- Označí asynchronní funkci. Funkce bude vždy vracet slib. Ostatní hodnoty jsou zabalené ve vyřešeném
slibu automaticky.
```javascript
async function f() {
    return 1;
}
f().then(alert); // 1
```
- nebo:
```javascript
async function f() {
    return Promise.resolve(1);
}

f().then(alert); // 1
```
## await
- Dá se použít pouze uvnitř asynchronní funkce. Donutí JavaScript čekat dokud se neprovede slib a nevratí
svůj výsledek.
```javascript
async function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 1000)
});
          
    let result = await promise; // wait until the promise resolves (*)

    alert(result); // "done!"
}
        
f();
```
## try
- Blok kódu, který se program pokusí spustit.
```javascript
try {
    console.log("Program běží");
}
```
## catch
- Zachytí chybu z try, aby aplikace nespadla.
```javascript
try {
    alert('Start of try runs');  // (1) <--
    lalala; // error, variable is not defined!
    alert('End of try (never reached)');  // (2)
} catch (err) {
    alert(`Error has occurred!`); // (3) <--
}
```