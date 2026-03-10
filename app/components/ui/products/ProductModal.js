"use client"
import { ChevronLeft } from 'lucide-react';
 
export default function ProductModal({ produto, open, onClose }) {

  if (!open || !produto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white w-[90%] max-w-md rounded-2xl p-6">
        <ChevronLeft className='mb-5' onClick={onClose}/>

        <div>
            <div className='flex flex-row gap-2 items-center'>
                <h2 className="text-lg font-bold text-gray-800">
                {produto.nome}
                </h2>
                <div className="flex gap-1">
                    <span>Estoque</span>                    
                    <span>
                        {produto.estoque?.quantidade ?? 0}
                    </span>
                </div>
            </div>
            <div className='flex flex-col'>
                <span>
                {produto.categoria}
                </span>
                <span className="font-semibold text-[#8E000C]">
                R${Number(produto.preco).toFixed(2)}
                </span>
            </div>
        </div>
        
        <div className='mt-5 '>
            <span className='font-semibold'>Descrição</span>
            <p className="text-sm text-gray-500 mt-1">
                {produto.descricao}
            </p>
        </div>

        <button          
          className="mt-6 w-full bg-[#8E000C] text-white py-2 rounded-full"
        >
          Adicionar ao Carrinho
        </button>

      </div>
    </div>
  )
}