"use client";

import { useEffect, useState } from "react";

import GraficoModal from "./grafico-modal";
import BotaoVerMais from "./botao-ver-mais";

export default function ProdutosMaisVendidos({ abrirModalInicial }) {
  const [produtos, setProdutos] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/produtos")
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text();
          throw new Error(text);
        }

        return r.json();
      })
      .then(setProdutos)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (abrirModalInicial) {
      setModalAberta(true);
    }
  }, [abrirModalInicial]);

  const produtosLimitados = produtos.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold">Produtos mais vendidos</h2>

        <BotaoVerMais grafico="produtos" onClick={() => setModalAberta(true)} />
      </div>

      {/* TABELA RESUMIDA */}

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Nome do Produto</th>
            <th>Preço</th>
            <th>Vendas</th>
          </tr>
        </thead>

        <tbody>
          {produtosLimitados.map((p, i) => (
            <tr key={i} className="border-t">
              <td>{p.nome}</td>

              <td>R$ {p.preco.toFixed(2)}</td>

              <td>{p.vendas}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}

      <GraficoModal
        aberto={modalAberta}
        fechar={() => setModalAberta(false)}
        titulo="Todos os produtos mais vendidos"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th>Nome do Produto</th>
              <th>Preço</th>
              <th>Vendas</th>
            </tr>
          </thead>

          <tbody>
            {produtos.map((p, i) => (
              <tr key={i} className="border-t">
                <td>{p.nome}</td>

                <td>R$ {p.preco.toFixed(2)}</td>

                <td>{p.vendas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GraficoModal>
    </div>
  );
}
