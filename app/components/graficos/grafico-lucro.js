"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import GraficoModal from "./grafico-modal";
import BotaoVerMais from "./botao-ver-mais";

export default function GraficoLucro({ periodo, abrirModalInicial }) {
  const [dados, setDados] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);

  useEffect(() => {
    fetch(`/api/dashboard/lucro?periodo=${periodo}`)
      .then((r) => r.json())
      .then(setDados);
  }, [periodo]);

  useEffect(() => {
    if (abrirModalInicial) {
      setModalAberta(true);
    }
  }, [abrirModalInicial]);

  // limite para o dashboard
  const dadosLimitados = dados.slice(-7);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold">Lucro</h2>

        <BotaoVerMais grafico="lucro" onClick={() => setModalAberta(true)} />
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dadosLimitados}>
          <XAxis dataKey="data" />
          <Tooltip />
          <Bar dataKey="lucro" fill="#8E000C" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* MODAL */}

      <GraficoModal
        aberto={modalAberta}
        fechar={() => setModalAberta(false)}
        titulo="Análise detalhada de lucro"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <XAxis dataKey="data" />
            <Tooltip />
            <Bar dataKey="lucro" fill="#8E000C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* tabela detalhada */}

        <table className="w-full text-sm mt-6">
          <thead>
            <tr className="text-left text-gray-500">
              <th>Data</th>
              <th>Lucro</th>
            </tr>
          </thead>

          <tbody>
            {dados.map((d, i) => (
              <tr key={i} className="border-t">
                <td>{d.data}</td>
                <td>R$ {d.lucro.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GraficoModal>
    </div>
  );
}
