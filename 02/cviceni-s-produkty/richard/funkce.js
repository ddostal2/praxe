function filterByCategory(products, category) {
  return products.filter((product) => product.category === category);
}

function sortByPrice(products, direction) {
  const multiplier = direction === "desc" ? -1 : 1;
  return [...products].sort((a, b) => (a.price - b.price) * multiplier);
}

function findMostExpensive(products) {
  return products.reduce((max, product) =>
    product.price > max.price ? product : max
  );
}

function cartTotal(cartItems, products) {
  return cartItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + product.price * item.quantity;
  }, 0);
}
