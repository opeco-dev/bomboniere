"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const pedidoId = params.pedidoId;

  const router = useRouter();

  const [pedido, setPedido] = useState(null);
  const [pixQr, setPixQr] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(null);

  // carregar pedido
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

  // contador do pix
  useEffect(() => {
    if (!pixQr?.expiraEm) return;

    const intervalo = setInterval(() => {
      const agora = new Date();
      const expira = new Date(pixQr.expiraEm);

      const diff = expira - agora;

      if (diff <= 0) {
        setTempoRestante("Expirado");
        clearInterval(intervalo);
        return;
      }

      const minutos = Math.floor(diff / 60000);
      const segundos = Math.floor((diff % 60000) / 1000);

      setTempoRestante(
        `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(intervalo);
  }, [pixQr]);

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

    setPixQr(data);
  }

  useEffect(() => {
    if (!pixQr) return;

    const intervalo = setInterval(async () => {
      const res = await fetch(`/api/pagamentos/status/${pedidoId}`);

      const data = await res.json();

      if (data.status === "pago") {
        clearInterval(intervalo);

        router.push(`/checkout/${pedidoId}/sucesso`);
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [pixQr]);

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
        <button
          onClick={pagarPix}
          className="w-full border-2 rounded-full py-3"
        >
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

          {tempoRestante && (
            <p className="text-sm mt-2 text-gray-600">
              Expira em: <span className="font-semibold">{tempoRestante}</span>
            </p>
          )}

          <button
            onClick={() => navigator.clipboard.writeText(pixQr.copiaCola)}
            className="mt-3 text-sm text-blue-600"
          >
            Copiar código PIX
          </button>

          {tempoRestante === "Expirado" && (
            <button
              onClick={pagarPix}
              className="mt-4 bg-[#8E000C] text-white px-6 py-2 rounded-full"
            >
              Gerar novo PIX
            </button>
          )}
        </div>
      )}
    </div>
  );
}
