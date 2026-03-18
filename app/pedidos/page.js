"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/ui/BottomNav";
import StatusPedido from "../components/ui/StatusPedido";
import { formatDateTime } from "@/app/lib/utils";

export default function PedidosPage() {
  const [saldo, setSaldo] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/clientes/saldo")
      .then((res) => res.json())
      .then((data) => setSaldo(data.saldo || 0));
  }, []);

  useEffect(() => {
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then(setPedidos);
  }, []);

  return (
    <div className="p-4 pb-28">
      <h1 className="text-lg font-semibold mb-4">Meus Pedidos</h1>
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <p className="text-xs text-gray-500">Saldo Devedor</p>

        <p className="text-lg font-semibold text-[#8E000C]">
          R$ -{(saldo ?? 0).toFixed(2)}
        </p>
      </div>
      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between mb-2">
              <div>
                <span className="text-sm font-semibold mr-2">
                  Pedido: {pedido.id.slice(0, 6)}
                </span>
                <StatusPedido status={pedido.status} />
              </div>

              <span className="text-sm text-gray-500 bg-slate-100 py-1 px-2 rounded-full">
                {formatDateTime(pedido.createdAt)}
              </span>
            </div>

            {pedido.itens.map((item) => {
              const sabor = item.saborSnapshot || item.variacao?.sabor;

              return (
                <div key={item.id} className="text-sm">
                  <div className="font-medium">
                    {item.produto.nome} x {item.quantidade}
                  </div>

                  {sabor && (
                    <div className="text-gray-500">
                      Sabor: <span className="font-medium">{sabor}</span>
                    </div>
                  )}
                </div>
              );
            })}

            <p className="text-right text-[#8E000C] text-md font-bold mt-2">
              R$ {pedido.total.toFixed(2)}
            </p>

            {pedido.status === "aberta" && (
              <button
                onClick={() => router.push(`/checkout/${pedido.id}`)}
                className="mt-3 w-full bg-[#8E000C] text-white py-2 rounded-lg text-sm"
              >
                Pagar pedido
              </button>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
