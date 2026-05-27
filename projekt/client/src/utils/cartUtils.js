/**
 * Adds a product to the cart. If the product already exists in the cart,
 * its quantity is increased by the specified amount.
 * 
 * @param {Array<{productId: string, quantity: number}>} cart - The current cart state.
 * @param {string} productId - The ID of the product to add.
 * @param {number} [quantity=1] - The quantity to add.
 * @returns {Array<{productId: string, quantity: number}>} The updated cart state.
 */
export const addToCart = (cart, productId, quantity = 1) => {
  const existingItemIndex = cart.findIndex(item => item.productId === productId);

  if (existingItemIndex > -1) {
    return cart.map((item, index) =>
      index === existingItemIndex
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [...cart, { productId, quantity }];
};

/**
 * Removes a product from the cart by its ID.
 * 
 * @param {Array<{productId: string, quantity: number}>} cart - The current cart state.
 * @param {string} productId - The ID of the product to remove.
 * @returns {Array<{productId: string, quantity: number}>} The updated cart state.
 */
export const removeFromCart = (cart, productId) => {
  return cart.filter(item => item.productId !== productId);
};

/**
 * Updates the quantity of a specific product in the cart.
 * The quantity is clamped to a minimum of 1.
 * 
 * @param {Array<{productId: string, quantity: number}>} cart - The current cart state.
 * @param {string} productId - The ID of the product to update.
 * @param {number} quantity - The new quantity.
 * @returns {Array<{productId: string, quantity: number}>} The updated cart state.
 */
export const updateQuantity = (cart, productId, quantity) => {
  const sanitizedQuantity = Math.max(1, quantity);
  return cart.map(item =>
    item.productId === productId
      ? { ...item, quantity: sanitizedQuantity }
      : item
  );
};

/**
 * Clears all items from the cart.
 * 
 * @returns {Array} An empty array representing the cleared cart state.
 */
export const clearCart = () => {
  return [];
};
