"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BotaoVerMais({ onClick, grafico }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick() {
    const isDashboard = pathname.includes("dashboard");

    if (isDashboard) {
      router.push(`/analise?grafico=${grafico}`);
      return;
    }

    if (onClick) onClick();
  }

  return (
    <button
      onClick={handleClick}
      className="text-sm text-[#8E000C] font-semibold"
    >
      Ver mais
    </button>
  );
}