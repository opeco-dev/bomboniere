"use client";

import { useEffect, useState } from "react";

import { BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis } from "recharts";

import GraficoModal from "./grafico-modal";
import BotaoVerMais from "./botao-ver-mais";

export default function GraficoVendas() {
  const [dados, setDados] = useState([]);
  const [tipo, setTipo] = useState("barra");

  useEffect(() => {
    async function carregar() {
      const periodos = ["hoje", "7dias", "30dias", "6meses", "12meses"];

      const resultados = await Promise.all(
        periodos.map((p) =>
          fetch(`/api/dashboard/vendas?periodo=${p}`).then((r) => r.json()),
        ),
      );

      const formatado = periodos.map((p, i) => ({
        periodo: p,
        total: resultados[i].total,
      }));

      setDados(formatado);
    }

    carregar();
  }, []);

  const dadosLimitados = dados.slice(-7);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between mb-3">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold">Vendas</h2>

          <BotaoVerMais onClick={() => setModalAberta(true)} />
        </div>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border rounded p-1"
        >
          <option value="barra">Barra</option>

          <option value="pizza">Pizza</option>
        </select>
      </div>

      {tipo === "barra" && (
        <BarChart width={400} height={250} data={dadosLimitados}>
          <XAxis dataKey="periodo" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="total" />
        </BarChart>
      )}

      {tipo === "pizza" && (
        <PieChart width={400} height={250}>
          <Pie data={dadosLimitados} dataKey="total" nameKey="periodo" />

          <Tooltip />
        </PieChart>
      )}
    </div>
  );
}
