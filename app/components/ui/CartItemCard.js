'use client'

import Image from 'next/image'
import { useCart } from '../contexts/CartContext';
import placeholder from "../../../public/placeholder.png"

export default function CartItemCard({ item }) {

  const { increase, decrease } = useCart()

  return (

    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow">

      <div className="relative w-20 h-20 bg-[#FFDDE0] rounded-lg">

        <Image
          src={item.imagens?.[0]?.url || placeholder}
          alt={item.nome}
          fill
          className="object-contain p-2"
        />

      </div>

      <div className="flex-1">

        <h3 className="font-semibold">
          {item.nome}
        </h3>

        <p className="text-gray-400 text-sm">
          {item.categoria}
        </p>

        <div className="flex items-center gap-2 mt-2">

          <button
            onClick={() => decrease(item.id)}
            className="w-7 h-7 bg-gray-200 rounded"
          >
            -
          </button>

          <span>{item.quantidade}</span>

          <button
            onClick={() => increase(item.id)}
            className="w-7 h-7 bg-gray-200 rounded"
          >
            +
          </button>

        </div>

      </div>

      <div className="text-[#8E000C] font-bold">

        R$ {(item.preco * item.quantidade).toFixed(2)}

      </div>

    </div>

  )
}