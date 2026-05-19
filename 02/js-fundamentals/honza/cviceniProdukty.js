import products from '../../data/products.json';

export function filterByCategory(products, category) {
  return products.filter((product) => product.category === category);
}

export function sortByPrice(products, direction) {
  const sorted = [...products].sort((a, b) => a.price - b.price);
  return direction === 'desc' ? sorted.reverse() : sorted;
}

export function findMostExpensive(products) {
  if (products.length === 0) return undefined;

  let mostExpensive = products[0];

  for (const product of products) {
    if (product.price > mostExpensive.price) {
      mostExpensive = product;
    }
  }

  return mostExpensive;
}

export function cartTotal(cartItems, products) {
  const priceById = new Map(products.map((p) => [p.id, p.price]));

  return cartItems.reduce((total, item) => {
    const price = priceById.get(item.productId);
    if (price === undefined) return total;
    return total + price * item.quantity;
  }, 0);
}
