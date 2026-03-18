"use client";

import { useState, useEffect } from "react";

export default function ClientModal({ open, onClose, cliente, setClientes }) {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    setor: "",
    senha: "",
    role: "user"
  });

  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome || "",
        telefone: cliente?.telefone || "",
        email: cliente.email || "",
        setor: cliente?.setor || "",
        senha: "",
      });
    } else {
      setForm({
        nome: "",
        telefone: "",
        email: "",
        setor: "",
        senha: "",
      });
    }
  }, [cliente]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function salvarCliente() {
    const method = cliente ? "PUT" : "POST";

    const url = cliente ? `/api/clientes/${cliente.id}` : "/api/clientes";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      console.error("Resposta não retornou JSON");
    }

    if (!res.ok) {
      alert(data?.error || "Erro ao salvar cliente");
      return;
    }

    if (cliente) {
      setClientes((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    } else {
      setClientes((prev) => [data, ...prev]);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-5">
          {cliente ? "Editar Usuário" : "Novo Usuário"}
        </h2>

        <div className="space-y-3">
          <div className="col-span-2">
            <label className="block text-sm font-bold mb-2">
              Nome Completo
            </label>
            <input
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-bold mb-2">Telefone</label>
            <input
              name="telefone"
              placeholder="Telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex gap-5">
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-2">Setor</label>
              <input
                name="setor"
                placeholder="Setor"
                value={form.setor}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold mb-2">Tipo</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          {!cliente && (
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-2">Senha</label>
              <input
                name="senha"
                type="password"
                placeholder="Senha"
                value={form.senha}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-full"
          >
            Cancelar
          </button>

          <button
            onClick={salvarCliente}
            className="flex-1 bg-[#8E000C] text-white py-2 rounded-full"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
