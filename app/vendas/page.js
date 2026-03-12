"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusPedido from "../components/ui/StatusPedido";
import AdminSidebar from "../components/ui/AdminSideBar";
import ConfirmModal from "../components/ui/ConfirmModal";
import { formatDateTime } from "@/app/lib/utils";
import { Trash2, RotateCcw } from "lucide-react";

export default function VendasPage() {
  const [vendas, setVendas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    fetch("/api/pedidos/admin")
      .then((res) => res.json())
      .then(setVendas);
  }, []);

  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function confirmarCancelamento() {
    const res = await fetch(`/api/pedidos/${pedidoSelecionado.id}/cancelar`, {
      method: "PATCH",
    });

    if (res.ok) {
      setVendas((prev) =>
        prev.map((v) =>
          v.id === pedidoSelecionado.id
            ? {
                ...v,
                ativo: !v.ativo,
                status: v.ativo ? "cancelado" : "aberta",
              }
            : v,
        ),
      );
    }

    setModalOpen(false);
    setPedidoSelecionado(null);
  }

  const descancelando = pedidoSelecionado?.status === "cancelado";

  return (
    <div className="p-6">
      <div className="flex items-center">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <h1 className="text-3xl font-bold">Vendas</h1>
      </div>

      <div className="space-y-4">
        {vendas.map((venda) => (
          <div key={venda.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between mb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPedidoSelecionado(venda);
                    setModalOpen(true);
                  }}
                >
                  {venda.status === "cancelado" ? (
                    <RotateCcw size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
                <span className="text-sm font-semibold">
                  Pedido: {venda.id.slice(0, 6)}
                  <p className="text-xs text-gray-500 mb-2">
                    Cliente: {venda.cliente?.nome || "Cliente não identificado"}
                  </p>
                </span>
                <StatusPedido status={venda.status} />
              </div>
              <span className="text-sm text-gray-500 bg-slate-100 justify-center items-center h-5 px-2 rounded-full">
                {formatDateTime(venda.createdAt)}
              </span>
            </div>

            {venda.itens.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span>
                  {item.produto.nome} x{item.quantidade}
                </span>

                <span>R$ {item.subtotal.toFixed(2)}</span>
              </div>
            ))}

            <p className="text-right text-[#8E000C] text-md font-bold mt-2">
              R$ {venda.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarCancelamento}
        confirmColor={descancelando ? "green" : "red"}
        title={descancelando ? "Reativar pedido" : "Cancelar pedido"}
        description={
          descancelando
            ? "Este pedido está cancelado. Deseja reativá-lo novamente?"
            : "Tem certeza que deseja cancelar este pedido?"
        }
      />
    </div>
  );
}
