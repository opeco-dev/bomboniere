"use client";

import { useEffect, useState } from "react";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function GraficoLucro() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard/lucro")
      .then((r) => r.json())
      .then(setDados);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Lucro Bruto</h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dados}>
          <XAxis dataKey="data" />

          <Tooltip />

          <Bar dataKey="lucro" fill="#8E000C" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
