"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

import AdminSidebar from "../components/ui/AdminSideBar";
import ConfirmModal from "../components/ui/ConfirmModal";
import ClientModal from "../components/ui/ClientModal";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clienteExcluir, setClienteExcluir] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/clientes")
      .then((res) => res.json())
      .then(setClientes);
  }, []);

  function novoCliente() {
    setClienteSelecionado(null);
    setModalOpen(true);
  }

  function editarCliente(usuario) {
    setClienteSelecionado(usuario);
    setModalOpen(true);
  }

  function abrirExcluir(usuario) {
    setClienteExcluir(usuario);
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
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <AdminSidebar />
          <h1 className="text-3xl font-bold ml-2">Usuários</h1>
        </div>

        <button
          onClick={novoCliente}
          className="flex items-center gap-2 bg-[#8E000C] text-white px-4 py-2 rounded-full"
        >
          <Plus size={18} />
          Novo Usuário
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {clientes.map((usuario) => {
          const role = usuario.role || "user";
          const isSelf = session?.user?.id === usuario.id;

          return (
            <div
              key={usuario.id}
              onClick={() => editarCliente(usuario)}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
            >
              <div>
                <div className="flex gap-2 items-center">
                  <p className="font-semibold">
                    {usuario.nome}
                    {isSelf && (
                      <span className="text-xs text-gray-400 ml-2">(Você)</span>
                    )}
                  </p>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full
                      ${
                        role === "admin"
                          ? "bg-red-100 text-[#8E000C]"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {role === "admin" ? "Administrador" : "Usuário"}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {usuario.cliente?.telefone || "—"}
                </p>
              </div>

              {/* BOTÃO EXCLUIR (não aparece no próprio usuário) */}
              {!isSelf && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirExcluir(usuario);
                  }}
                >
                  <Trash2 size={18} color="#8E000C" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL CLIENTE */}
      <ClientModal
        open={modalOpen}
        cliente={clienteSelecionado}
        onClose={() => setModalOpen(false)}
        setClientes={setClientes}
      />

      {/* MODAL CONFIRMAÇÃO */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={excluirCliente}
        title="Excluir usuário"
        description="Tem certeza que deseja excluir este usuário?"
        confirmColor="red"
      />
    </div>
  );
}
