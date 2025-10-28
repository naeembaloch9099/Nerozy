/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    setCart((prev) => {
      const idx = prev.findIndex(
        (p) =>
          p.id === item.id && p.color === item.color && p.size === item.size
      );
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity = (copy[idx].quantity || 0) + (item.quantity || 1);
        return copy;
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }

  function removeFromCart(index) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
