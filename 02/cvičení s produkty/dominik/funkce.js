import produkty from "../../data/products.json" with { type: "json" };

function filterByCategory(products, category) {
    return products.filter((product) => product.category === category);
}

function sortByPrice(products, direction) { // direction - asc/desc
    const dir = String(direction).toLowerCase();
    const factor = dir === "desc" ? -1 : 1;

    return [...products].sort((a, b) => (a.price - b.price) * factor);
}

function findMostExpensive(products) {
    if (!products.length) return undefined;

    return products.reduce((best, product) =>
        product.price > best.price ? product : best
    );
}

function cartTotal(cartItems, products) {
    // Vytvoří tabulku(id -> produkt)
    const byId = new Map(products.map((p) => [p.id, p]));

    // projde cartItems, vytáhne z toho cenu produktu(pomocí id) a pak sečte všechny ceny
    return cartItems.reduce((sum, item) => {
        const product = byId.get(item.id ?? item.productId); // item.id nebo item.productId
        if (!product) return sum;
        const qty = Number(item.quantity ?? item.qty ?? 1); // item.quantity nebo item.qty nebo 1
        return sum + product.price * qty;
    }, 0);
}

//console.log(filterByCategory(produkty, "books"))
//console.log(sortByPrice(produkty, "asc"))
//console.log(findMostExpensive(produkty))


/*const cartItems = [
    { id: 2 },
    { id: 5 },
];

console.log(cartTotal(cartItems, produkty));*/