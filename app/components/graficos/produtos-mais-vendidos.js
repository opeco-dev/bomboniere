"use client";

import { useEffect, useState } from "react";

export default function ProdutosMaisVendidos() {
  const [produtos, setProdutos] = useState([]);

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

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold mb-3">Produtos mais vendidos</h2>

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
    </div>
  );
}
