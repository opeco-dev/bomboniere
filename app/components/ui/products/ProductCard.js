"use client";
import Image from "next/image";
import placeholder from "../../../../public/placeholder.png"

export default function ProductCard({ produto, onClick }) {
  return (
    <div
      onClick={() => onClick(produto)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
    >
      <Image
        className="w-32 h-32 object-contain rounded-lg mb-2"
        src={produto.imagens?.[0]?.url || placeholder}
        width={400}
        height={400}
        alt="image-prod"
      />
      <h3 className="font-semibold text-gray-800">{produto.nome}</h3>

      <p className="text-xs text-gray-500 mt-1">{produto.categoria}</p>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-bold text-[#8E000C]">
          R$ {Number(produto.preco).toFixed(2)}
        </span>

        <span className="text-xs text-gray-400">
          Estoque: {produto.estoque?.quantidade ?? 0}
        </span>
      </div>
    </div>
  );
}
