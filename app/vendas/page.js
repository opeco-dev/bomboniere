"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusPedido from "../components/ui/StatusPedido";
import AdminSidebar from "../components/ui/AdminSideBar";

export default function VendasPage() {
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    fetch("/api/pedidos/admin")
      .then((res) => res.json())
      .then(setVendas);
  }, []);

  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <h1 className="text-3xl font-bold">Pedidos Recebidos</h1>
      </div>

      <div className="space-y-4">
        {vendas.map((venda) => (
          <div key={venda.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">
                Pedido: {venda.id.slice(0, 6)}
                <p className="text-xs text-gray-500 mb-2">
                  Cliente: {venda.cliente?.nome || "Cliente não identificado"}
                </p>
              </span>

              <StatusPedido status={venda.status} />
            </div>

            {venda.itens.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span>
                  {item.produto.nome} x{item.quantidade}
                </span>

                <span>R$ {item.subtotal.toFixed(2)}</span>
              </div>
            ))}

            <p className="text-right text-[#8E000C] text-sm font-semibold mt-2">
              R$ {venda.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
