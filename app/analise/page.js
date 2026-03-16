"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminSidebar from "../components/ui/AdminSideBar";
import KpiCards from "../components/graficos/kpi-cards";
import GraficoLucro from "../components/graficos/grafico-lucro";
import ProdutosMaisVendidos from "../components/graficos/produtos-mais-vendidos";
import PedidosRecentes from "../components/graficos/pedidos-recentes";

export default function AnalisePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();

  const grafico = searchParams.get("grafico");

  const [abrirPedidos, setAbrirPedidos] = useState(false);
  const [abrirProdutos, setAbrirProdutos] = useState(false);
  const [abrirLucro, setAbrirLucro] = useState(false);

  useEffect(() => {
    if (grafico === "pedidos") {
      setAbrirPedidos(true);
    }

    if (grafico === "produtos") {
      setAbrirProdutos(true);
    }

    if (grafico === "lucro") {
      setAbrirLucro(true);
    }
  }, [grafico]);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#fafafa] flex flex-col ">
      <div className="flex items-center mb-6">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <h1 className="text-2xl md:text-3xl font-bold">Análise</h1>
      </div>

      <div className="mb-6">
        <KpiCards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <GraficoLucro />
        </div>

        <ProdutosMaisVendidos abrirModalInicial={abrirProdutos} />
      </div>

      <PedidosRecentes abrirModalInicial={abrirPedidos} />
    </div>
  );
}
