"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, ClipboardList, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const nav = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/carrinho", icon: ShoppingCart, label: "Carrinho" },
    { href: "/pedidos", icon: ClipboardList, label: "Pedidos" },
    { href: "/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      {nav.map((item, i) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={i}
            href={item.href}
            className={`flex flex-col items-center text-xs ${
              active ? "text-[#8E000C]" : "text-gray-400"
            }`}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
