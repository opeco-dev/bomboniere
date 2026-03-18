"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const getItemKey = (item) => `${item.id}-${item.variacaoId ?? "base"}`;

const isSameCartItem = (a, b) =>
  a.id === b.id && (a.variacaoId ?? null) === (b.variacaoId ?? null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");

      if (stored) {
        const parsed = JSON.parse(stored);
        setCart(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setCart([]);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, mounted]);

  function addToCart(produto) {
    setCart((prev) => {
      const existing = prev.find((item) => isSameCartItem(item, produto));

      if (existing) {
        return prev.map((item) =>
          isSameCartItem(item, produto)
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          ...produto,
          quantidade: 1,
          cartKey: getItemKey(produto),
        },
      ];
    });
  }

  function increase(id, variacaoId = null) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && (item.variacaoId ?? null) === (variacaoId ?? null)
          ? { ...item, quantidade: item.quantidade + 1 }
          : item,
      ),
    );
  }

  function decrease(id, variacaoId = null) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && (item.variacaoId ?? null) === (variacaoId ?? null)
            ? { ...item, quantidade: item.quantidade - 1 }
            : item,
        )
        .filter((item) => item.quantidade > 0),
    );
  }

  function updateQuantity(id, quantidade, variacaoId = null) {
    if (quantidade <= 0) {
      removeFromCart(id, variacaoId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id && (item.variacaoId ?? null) === (variacaoId ?? null)
          ? { ...item, quantidade }
          : item,
      ),
    );
  }

  function removeFromCart(id, variacaoId = null) {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id && (item.variacaoId ?? null) === (variacaoId ?? null)
          ),
      ),
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItens = cart.reduce(
    (acc, item) => acc + Number(item.quantidade || 0),
    0,
  );

  const total = cart.reduce(
    (acc, item) => acc + Number(item.preco || 0) * Number(item.quantidade || 0),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        updateQuantity,
        removeFromCart,
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
