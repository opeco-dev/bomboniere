'use client'

import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {

  const [cart, setCart] = useState([])

  const addToCart = (produto) => {

    setCart(prev => {

      const existing = prev.find(p => p.id === produto.id)

      if (existing) {
        return prev.map(p =>
          p.id === produto.id
            ? { ...p, quantidade: p.quantidade + 1 }
            : p
        )
      }

      return [...prev, { ...produto, quantidade: 1 }]
    })
  }

  const increase = (id) => {

    setCart(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, quantidade: p.quantidade + 1 }
          : p
      )
    )
  }

  const decrease = (id) => {

    setCart(prev =>
      prev
        .map(p =>
          p.id === id
            ? { ...p, quantidade: p.quantidade - 1 }
            : p
        )
        .filter(p => p.quantidade > 0)
    )
  }

  const clearCart = () => setCart([])

  const total = cart.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)