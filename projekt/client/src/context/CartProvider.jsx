import {createContext, useCallback, useEffect, useMemo, useState} from "react";
import { getProducts } from "../api/ApiService.js";
import {addToCartState, removeFromCartState, updateQuantityState} from "../utils/cartUtils.js";

export const CartContext = createContext(undefined);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                setProducts(await getProducts());
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError(err.message || 'Nepodařilo se načíst produkty.');
                console.error(err);
            }
        };

        load();
    }, []);

    const addToCart = useCallback((productId, quantity = 1) => {
        setCartItems((cart) => addToCartState(cart, String(productId), quantity));
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems((cart) => removeFromCartState(cart, String(productId)));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        setCartItems((cart) => updateQuantityState(cart, String(productId), quantity));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);


    const totalItems = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );

    const totalPrice = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                const product = products.find((product) => String(product.id) === String(item.productId));
                if (!product) return sum;
                return sum + product.price * item.quantity;
            }, 0),
        [cartItems, products]
    );

    const value = useMemo(
        () => ({
            cartItems,
            products,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            loading,
            error,
        }),
        [
            cartItems,
            products,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            loading,
            error,
        ]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}