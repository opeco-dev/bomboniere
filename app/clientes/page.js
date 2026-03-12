"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminSidebar from "../components/ui/AdminSideBar";
import ConfirmModal from "../components/ui/ConfirmModal";
import ClientModal from "../components/ui/ClientModal";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clienteExcluir, setClienteExcluir] = useState(null);

  useEffect(() => {
    fetch("/api/clientes")
      .then((res) => res.json())
      .then(setClientes);
  }, []);

  function novoCliente() {
    setClienteSelecionado(null);
    setModalOpen(true);
  }

  function editarCliente(cliente) {
    setClienteSelecionado(cliente);
    setModalOpen(true);
  }

  function abrirExcluir(cliente) {
    setClienteExcluir(cliente);
    setConfirmOpen(true);
  }

  async function excluirCliente() {
    await fetch(`/api/clientes/${clienteExcluir.id}`, {
      method: "DELETE",
    });

    setClientes((prev) => prev.filter((c) => c.id !== clienteExcluir.id));

    setConfirmOpen(false);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <AdminSidebar/>
          <h1 className="text-3xl font-bold">Clientes</h1>
        </div>

        <button
          onClick={novoCliente}
          className="flex items-center gap-2 bg-[#8E000C] text-white px-4 py-2 rounded-full"
        >
          <Plus size={18} />
          Novo cliente
        </button>
      </div>

      <div className="space-y-3">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            onClick={() => editarCliente(cliente)}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
          >
            <div>
              <p className="font-semibold">{cliente.nome}</p>
              <p className="text-sm text-gray-500">{cliente.telefone}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                abrirExcluir(cliente);
              }}
            >
              <Trash2 size={18} color="#8E000C" />
            </button>
          </div>
        ))}
      </div>

      <ClientModal
        open={modalOpen}
        cliente={clienteSelecionado}
        onClose={() => setModalOpen(false)}
        setClientes={setClientes}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={excluirCliente}
        title="Desativar cliente"
        description="Tem certeza que deseja desativar este cliente?"
        confirmColor="red"
      />
    </div>
  );
}
