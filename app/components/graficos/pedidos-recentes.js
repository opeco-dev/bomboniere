"use client";

import { useEffect, useState } from "react";

import GraficoModal from "./grafico-modal";
import BotaoVerMais from "./botao-ver-mais";

export default function PedidosRecentes({ abrirModalInicial }) {
  const [pedidos, setPedidos] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/pedidos")
      .then((r) => r.json())
      .then(setPedidos);
  }, []);

  useEffect(() => {
    if (abrirModalInicial) {
      setModalAberta(true);
    }
  }, [abrirModalInicial]);

  const pedidosLimitados = pedidos.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold">Pedidos Recentes</h2>

        <BotaoVerMais grafico="pedidos" onClick={() => setModalAberta(true)} />
      </div>

      {/* TABELA RESUMIDA */}

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
          {pedidosLimitados.map((p) => (
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

      {/* MODAL */}

      <GraficoModal
        aberto={modalAberta}
        fechar={() => setModalAberta(false)}
        titulo="Todos os pedidos"
      >
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
      </GraficoModal>
    </div>
  );
}
