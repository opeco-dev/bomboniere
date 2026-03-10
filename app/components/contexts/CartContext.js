"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  // carregar carrinho apenas no client
  useEffect(() => {
    const stored = localStorage.getItem("cart");

    if (stored) {
      setCart(JSON.parse(stored));
    }

    setMounted(true);
  }, []);

  // salvar no localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  function addToCart(produto) {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === produto.id);

      if (existing) {
        return prev.map((p) =>
          p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p,
        );
      }

      return [...prev, { ...produto, quantidade: 1 }];
    });
  }

  function increase(id) {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantidade: p.quantidade + 1 } : p,
      ),
    );
  }

  function decrease(id) {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantidade: p.quantidade - 1 } : p))
        .filter((p) => p.quantidade > 0),
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItens = cart.reduce((acc, item) => acc + item.quantidade, 0);

  const total = cart.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        clearCart,
        totalItens,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);