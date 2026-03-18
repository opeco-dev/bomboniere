"use client";

import Image from "next/image";
import { useCart } from "../contexts/CartContext";

export default function CartItemCard({ item }) {
  const { increase, decrease, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-xl p-3 shadow flex gap-3">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
        {item.imagem ? (
          <Image
            src={item.imagem}
            alt={item.nomeCarrinho || item.nome}
            fill
            className="object-contain"
          />
        ) : null}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold">{item.nome}</h3>

        {item.sabor && (
          <p className="text-sm text-gray-500">
            Sabor: <span className="font-medium">{item.sabor}</span>
          </p>
        )}

        <p className="text-sm text-[#8E000C] font-semibold">
          R$ {Number(item.preco).toFixed(2)}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrease(item.id, item.variacaoId)}
              className="w-8 h-8 rounded-full border"
            >
              -
            </button>

            <span>{item.quantidade}</span>

            <button
              onClick={() => increase(item.id, item.variacaoId)}
              className="w-8 h-8 rounded-full border"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.id, item.variacaoId)}
            className="text-sm text-red-600"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}