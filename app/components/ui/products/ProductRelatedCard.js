export default function ProductRelatedCard({ produto, onClick }) {

  return (
    <div
      onClick={() => onClick?.(produto)}
      className="min-w-[110px] cursor-pointer"
    >

      <img
        src={produto.imagens?.[0]?.url || "/placeholder.png"}
        className="w-full h-20 object-contain rounded-lg bg-gray-50"
      />

      <p className="text-xs mt-1 line-clamp-2">
        {produto.nome}
      </p>

      <span className="text-xs font-semibold text-[#8E000C]">
        R$ {Number(produto.preco).toFixed(2)}
      </span>

    </div>
  )
}