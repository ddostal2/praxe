import { useContext } from 'react';
import { CartContext } from '../context/CartProvider.jsx';

/**
 * Přístup ke stavu košíku. Musí být volán uvnitř CartProvider.
 */
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart musí být použit uvnitř CartProvider.');
  }

  return context;
}
