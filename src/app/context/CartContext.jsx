"use client";

import { useState, useContext, createContext, useMemo } from "react";

/* Contexto del carrito de compra.
    Creamos el contexto del carrito, que se encargará de almacenar la información del carrito de compras 
    y proporcionar funciones para manipularlo a lo largo de la aplicación. 
    Este contexto permitirá a los componentes acceder y modificar el estado del carrito de manera centralizada, 
    facilitando la gestión de los productos añadidos, las cantidades, y otras funcionalidades 
    relacionadas con el proceso de compra.
*/
const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    function addToCart(item) {
        const cartItem = {
            id: crypto.randomUUID(),
            ...item,
            createdAt: new Date().toISOString(),
        };

        setCartItems((prev) => [...prev, cartItem]);
    }

    function removeFromCart(itemId) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    }

    function clearCart() {
        setCartItems([]);
    }

    const cartTotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            return sum + Number(item.finalTotal || 0);
        }, 0);
    }, [cartItems]);

    const cartQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            return sum + Number(item.totalUnits || 0);
        }, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        cartTotal,
        cartQuantity,
        addToCart,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
}


