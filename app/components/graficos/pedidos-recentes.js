"use client";

import { useEffect, useState } from "react";

export default function PedidosRecentes() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard/pedidos")
      .then((r) => r.json())
      .then(setPedidos);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold">Pedidos Recentes</h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-left">
            <th>ID</th>
            <th>Cliente</th>
            <th>Qtd Itens</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id} className="border-t text-left">
              <td>#{p.id.slice(0, 6)}</td>

              <td>{p.cliente?.nome}</td>

              <td>{p.itens.length}</td>

              <td>R$ {p.total.toFixed(2)}</td>

              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
