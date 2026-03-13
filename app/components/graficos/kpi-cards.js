"use client";

import { useEffect, useState } from "react";

export default function KpiCards() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/kpis")
      .then((r) => r.json())
      .then(setDados)
      .catch(console.error);
  }, []);

  if (!dados) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 h-20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total em Vendas",
      value: `R$ ${(dados.totalVendas ?? 0).toFixed(2)}`,
    },
    {
      label: "Total em Pedidos",
      value: dados.totalPedidos ?? 0,
    },
    {
      label: "Total em Lucro Líquido",
      value: `R$ ${(dados.lucroLiquido ?? 0).toFixed(2)}`,
    },
    {
      label: "Total em Estoque",
      value: dados.totalEstoque ?? 0,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-gray-500">{c.label}</p>

          <p className="text-[#8E000C] font-bold text-lg mt-1">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
