"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function ProductModal({ produto, open, onClose }) {
  const [index, setIndex] = useState(0);

  if (!open || !produto) return null;
  
  const imagens = produto.imagens || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white w-[90%] max-w-md rounded-2xl p-6">
        <ChevronLeft className="mb-5" onClick={onClose} />
        
        {imagens.length > 0 && (
          <div className="mb-4">

            <img
              src={imagens[index].url}
              className="w-full h-48 object-contain rounded-xl"
            />

            <div className="flex gap-2 mt-2 overflow-x-auto">
              {imagens.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  onClick={() => setIndex(i)}
                  className={`w-16 h-16 rounded-lg object-contain cursor-pointer border ${
                    index === i ? "border-[#8E000C]" : "border-transparent"
                  }`}
                />
              ))}
            </div>

          </div>
        )}

        <div>
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-lg font-bold text-gray-800">{produto.nome}</h2>
            <div className="flex gap-1">
              <span>Estoque</span>
              <span>{produto.estoque?.quantidade ?? 0}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span>{produto.categoria}</span>
            <span className="font-semibold text-[#8E000C]">
              R${Number(produto.preco).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-5 ">
          <span className="font-semibold">Descrição</span>
          <p className="text-sm text-gray-500 mt-1">{produto.descricao}</p>
        </div>

        <button className="mt-6 w-full bg-[#8E000C] text-white py-2 rounded-full">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
