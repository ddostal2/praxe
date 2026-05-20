import products from "../../data/products.json" with { type: "json" };

const SORT_DIRECTION = {
    DESCENDING: "desc",
};

const DEFAULT_CART_ITEM_QUANTITY = 1;

function filterByCategory(products, category) {
    return products.filter((product) => product.category === category);
}

function sortByPrice(products, direction) {
    const normalizedDirection = String(direction).toLowerCase();
    const priceSortMultiplier =
        normalizedDirection === SORT_DIRECTION.DESCENDING ? -1 : 1;

    return [...products].sort(
        (firstProduct, secondProduct) =>
            (firstProduct.price - secondProduct.price) * priceSortMultiplier
    );
}

function findMostExpensive(products) {
    if (products.length === 0) return undefined;

    return products.reduce((mostExpensiveProduct, product) =>
        product.price > mostExpensiveProduct.price
            ? product
            : mostExpensiveProduct
    );
}

function cartTotal(cartItems, products) {
    const productsById = new Map(
        products.map((product) => [product.id, product])
    );

    return cartItems.reduce((total, cartItem) => {
        const productId = cartItem.id ?? cartItem.productId;
        const product = productsById.get(productId);

        if (!product) return total;

        const quantity = Number(
            cartItem.quantity ?? cartItem.qty ?? DEFAULT_CART_ITEM_QUANTITY
        );

        return total + product.price * quantity;
    }, 0);
}

/*
const sampleCartItems = [
    { id: 2 },
    { id: 5 },
];

console.log(filterByCategory(products, "clothing"));
console.log(sortByPrice(products, "asc"));
console.log(findMostExpensive(products));
console.log(cartTotal(sampleCartItems, products));
*/
