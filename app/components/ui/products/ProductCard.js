"use client";

import Image from "next/image";
import placeholder from "../../../../public/placeholder.png";

export default function ProductCard({ produto, onClick }) {
  const variacoes = Array.isArray(produto?.variacoes) ? produto.variacoes : [];

  const qtdVariacoes = variacoes.length;

  const estoqueBase = Array.isArray(produto?.estoque)
    ? produto.estoque.reduce(
        (total, item) => total + Number(item?.quantidade || 0),
        0,
      )
    : Number(produto?.estoque?.quantidade || 0);

  const estoqueVariacoes = variacoes.reduce((total, variacao) => {
    const estoqueDaVariacao = Array.isArray(variacao?.estoque)
      ? variacao.estoque.reduce(
          (subtotal, item) => subtotal + Number(item?.quantidade || 0),
          0,
        )
      : 0;

    return total + estoqueDaVariacao;
  }, 0);

  const estoqueAtual = qtdVariacoes > 0 ? estoqueVariacoes : estoqueBase;

  const imagemPrincipal = produto?.imagens?.[0]?.url || placeholder;

  return (
    <div
      onClick={() => onClick(produto)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
    >
      <Image
        className="w-32 h-32 object-contain rounded-lg mb-2"
        src={imagemPrincipal}
        width={400}
        height={400}
        alt={produto?.nome || "image-prod"}
      />

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800">{produto.nome}</h3>

        {qtdVariacoes > 0 && (
          <span className="text-[10px] whitespace-nowrap bg-[#8E000C]/10 text-[#8E000C] px-2 py-1 rounded-full font-medium">
            {qtdVariacoes} sabor{qtdVariacoes > 1 ? "es" : ""}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-1">{produto.categoria}</p>

      <div className="mt-3 flex justify-between items-center gap-3">
        <span className="text-sm font-bold text-[#8E000C]">
          R$ {Number(produto.preco).toFixed(2)}
        </span>

        <span className="text-xs text-gray-400">Estoque: {estoqueAtual}</span>
      </div>
    </div>
  );
}
