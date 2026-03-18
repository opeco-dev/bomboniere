"use client";

import { useEffect, useState } from "react";

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-[110px] animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-pink-100 mb-4" />
      <div className="w-24 h-3 bg-gray-100 rounded mb-2" />
      <div className="w-16 h-5 bg-gray-200 rounded" />
    </div>
  );
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));
}

export default function ProdutoKpiCards() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch("/api/produtos/kpis")
      .then((r) => r.json())
      .then(setDados)
      .catch(console.error);
  }, []);

  if (!dados) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total em Estoque",
      value: dados.totalEstoque ?? 0,
      isMoney: false,
    },
    {
      label: "Total em Produtos",
      value: dados.totalProdutos ?? 0,
      isMoney: false,
    },
    {
      label: "Itens Estoque Crítico",
      value: dados.itensEstoqueCritico ?? 0,
      isMoney: false,
    },
    {
      label: "Itens Vencimento Crítico",
      value: dados.itensVencimentoCritico ?? 0,
      isMoney: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[110px] flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-pink-100/80 mb-4" />

          <div>
            <p className="text-[11px] md:text-xs text-gray-500 leading-tight">
              {card.label}
            </p>

            <p className="text-[#8E000C] font-bold text-lg md:text-2xl mt-1">
              {card.isMoney ? formatarMoeda(card.value) : card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
