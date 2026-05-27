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
            }catch(error) {
                setLoading(false);
                setError(error);
                console.log(error);
            }
        };

        load();
    }, []);

    const addToCart = useCallback((productId, quantity = 1) => {
        setCartItems((cart) => addToCartState(cart, productId, quantity));
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems((cart) => removeFromCartState(cart, productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        setCartItems((cart) => updateQuantityState(cart, productId, quantity));
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

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            loading,
            error,
        }}>
            {children}
        </CartContext.Provider>
    )
}