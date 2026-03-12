"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import ProductRelatedCard from "./ProductRelatedCard";

export default function ProductModal({ produto, open, onClose }) {
  const [index, setIndex] = useState(0);
  const [relacionados, setRelacionados] = useState([]);
  const [produtoAtual, setProdutoAtual] = useState(produto);

  const { addToCart } = useCart();
  
  useEffect(() => {
    if (produto) {
      setProdutoAtual(produto)
    }
  }, [produto])

  useEffect(() => {
    if (!produtoAtual) return;

    fetch(
      `/api/produtos/relacionados?categoria=${produtoAtual.categoria}&produtoId=${produtoAtual.id}`,
    )
      .then((res) => res.json())
      .then((data) => setRelacionados(data));
  }, [produtoAtual]);

  if (!open || !produtoAtual) return null;

  const imagens = produtoAtual.imagens || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white w-[90%] max-w-md rounded-2xl p-6">
        <ChevronLeft className="mb-5 cursor-pointer" onClick={onClose} />

        {imagens.length > 0 && (
          <div className="mb-4">
            <img
              src={imagens[index].url}
              // height={48}
              // width={100}
              alt="imagem-principal"
              className="w-full h-48 object-contain rounded-xl"
            />

            <div className="flex gap-2 mt-2 overflow-x-auto">
              {imagens.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  // height={16}
                  // width={16}
                  alt="imagem-secundária"
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
            <h2 className="text-lg font-bold text-gray-800">{produtoAtual.nome}</h2>

            <div className="flex gap-1 text-sm">
              <span>Estoque</span>
              <span>{produtoAtual.estoque?.quantidade ?? 0}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{produtoAtual.categoria}</span>

            <span className="font-semibold text-[#8E000C]">
              R${Number(produtoAtual.preco).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <span className="font-semibold">Descrição</span>
          <p className="text-sm text-gray-500 mt-1">{produtoAtual.descricao}</p>
        </div>

        {/* PRODUTOS RELACIONADOS */}

        {relacionados.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Produtos relacionados</h3>

            <div className="flex gap-3 overflow-x-auto">
              {relacionados.map((p) => (
                <ProductRelatedCard 
                  key={p.id}
                  produto={p}
                  onClick={(p) => {
                    setProdutoAtual(p)
                    setIndex(0)                    
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <button
          className="mt-6 w-full bg-[#8E000C] text-white py-2 rounded-full"
          onClick={() => {
            addToCart(produtoAtual);
            onClose();
          }}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
