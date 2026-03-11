"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const pedidoId = params.pedidoId;

  const router = useRouter();

  const [pedido, setPedido] = useState(null);
  const [pixQr, setPixQr] = useState(null);

  useEffect(() => {
    async function carregarPedido() {
      const res = await fetch(`/api/pedidos/${pedidoId}`);

      if (!res.ok) {
        console.error("Erro ao buscar pedido");
        return;
      }

      const data = await res.json();

      setPedido(data);
    }

    carregarPedido();
  }, [pedidoId]);
  async function pagarPix() {
    const res = await fetch("/api/pagamentos/pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendaId: pedidoId,
      }),
    });

    const data = await res.json();

    setPixQr(data); // guarda tudo
  }

  if (!pedido) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.push("/pedidos")} className="p-2">
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-lg font-semibold">Checkout</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4">
        {pedido.itens.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-1">
            <span>
              {item.produto.nome} x {item.quantidade}
            </span>

            <span>R$ {item.subtotal.toFixed(2)}</span>
          </div>
        ))}

        <p className="text-right text-[#8E000C] font-semibold mt-2">
          R$ {pedido.total.toFixed(2)}
        </p>
      </div>

      <h2 className="text-sm font-semibold mb-2">Forma de pagamento</h2>

      <div className="space-y-3">
        <button onClick={pagarPix} className="w-full border-2 rounded-full py-3">
          Pagar com PIX
        </button>        
      </div>

      {pixQr && (
        <div className="mt-6 flex flex-col items-center justify-center">
          <h3 className="text-sm mb-2">Escaneie o PIX</h3>

          <img
            src={`data:image/png;base64,${pixQr.qrBase64}`}
            className="w-72 h-72"
          />

          <button
            onClick={() => navigator.clipboard.writeText(pixQr.copiaCola)}
          >
            Copiar código PIX
          </button>
        </div>
      )}
    </div>
  );
}
