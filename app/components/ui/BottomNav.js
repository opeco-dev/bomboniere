'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingCart, ClipboardList, User } from "lucide-react"
import { useCart } from "../contexts/CartContext"

export default function BottomNav() {

  const pathname = usePathname()
  const { totalItens } = useCart()

  function isActive(path) {
    return pathname === path
  }

  return (

    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">

      <Link
        href="/dashboard"
        className={`flex flex-col items-center ${
          isActive("/dashboard") ? "text-[#8E000C]" : "text-gray-500"
        }`}
      >
        <Home size={22} />
        Início
      </Link>


      <Link
        href="/carrinho"
        className={`relative flex flex-col items-center ${
          isActive("/carrinho") ? "text-[#8E000C]" : "text-gray-500"
        }`}
      >
        <ShoppingCart size={22} />

        {totalItens > 0 && (
          <span className="absolute -top-1 -right-2 bg-[#8E000C] text-white text-[10px] px-1.5 rounded-full">
            {totalItens}
          </span>
        )}
        Carrinho
      </Link>


      <Link
        href="/pedidos"
        className={`flex flex-col items-center ${
          isActive("/pedidos") ? "text-[#8E000C]" : "text-gray-500"
        }`}
      >
        <ClipboardList size={22} />
        Pedidos
      </Link>


      <Link
        href="/perfil"
        className={`flex flex-col items-center ${
          isActive("/perfil") ? "text-[#8E000C]" : "text-gray-500"
        }`}
      >
        <User size={22} />
        Perfil
      </Link>

    </nav>
  )
}