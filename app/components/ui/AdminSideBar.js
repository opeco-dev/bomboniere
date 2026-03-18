"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"

export default function AdminSidebar() {

  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const menu = [
    { href: "/dashboard", label: "Início" },
    { href: "/produtos", label: "Produtos" },
    { href: "/vendas", label: "Vendas" },
    { href: "/clientes", label: "Usuários" },
    { href: "/analise", label: "Análise" },
    { href: "/configuracoes", label: "Configurações" },
  ]

  return (
    <>
      {/* botão hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="p-3"
      >
        <Menu size={24} />
      </button>

      {/* overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-52 bg-[#8E000C] transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="px-4 py-12 space-y-2">

          {menu.map((item) => {

            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition
                  ${
                    active
                      ? "bg-[#FFDDE0] text-[#8E000C] font-semibold"
                      : "text-white hover:bg-white/10"
                  }
                `}
              >
                {item.label}
              </Link>
            )
          })}

        </div>

      </div>
    </>
  )
}
