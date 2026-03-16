"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/ui/BottomNav";
import AdminSidebar from "../components/ui/AdminSideBar";
import ProductCard from "../components/ui/products/ProductCard";
import ProductModal from "../components/ui/products/ProductModal";
import KpiCards from "../components/graficos/kpi-cards";
import GraficoLucro from "../components/graficos/grafico-lucro";
import ProdutosMaisVendidos from "../components/graficos/produtos-mais-vendidos";
import PedidosRecentes from "../components/graficos/pedidos-recentes";
import FiltroPeriodo from "../components/ui/FiltroPeriodo";

const VIEWS = {
  CLIENTE: "cliente",
  ADMIN: "admin",
};

export default function DashboardPage() {
  const [saldo, setSaldo] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [periodo,setPeriodo]=useState("all");

  useEffect(() => {
    fetch("/api/clientes/saldo")
      .then((res) => res.json())
      .then((data) => setSaldo(data.saldo || 0));
  }, []);

  useEffect(() => {
    fetch("/api/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  function abrirProduto(produto) {
    setProdutoSelecionado(produto);
    setModalOpen(true);
  }

  const { data: session, status } = useSession();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
        <span className="text-sm text-gray-600">Carregando seu painel...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  const role = session?.user?.role || "user";
  const view = role === "admin" ? VIEWS.ADMIN : VIEWS.CLIENTE;

  const roleLabel = role === "admin" ? "Administrador" : "Cliente";

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top bar */}
      <header className="px-4 pt-4 pb-3 flex items-center justify-between bg-white shadow-sm">
        {/* Botão hamburger apenas admin */}
        {view === VIEWS.ADMIN ? (
          <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        ) : (
          <div className="w-9" />
        )}

        <div className="flex-1 mx-3">
          {view === VIEWS.CLIENTE ? (
            <>
              <p className="text-xs text-gray-500 font-medium">Saldo Devedor</p>
              <p className="text-xl font-semibold text-[#8E000C] -mt-0.5">
                R$ -{(saldo || 0).toFixed(2)}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500 font-medium">Dashboard</p>
              <p className="text-3xl font-bold text-gray-800 -mt-0.5">
                Visão geral
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] px-2 py-1.5 rounded-full bg-gray-100 text-gray-600">
            {roleLabel}
          </span>
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="text-[12px] text-gray-400 hover:text-gray-600"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-3">
        {view === VIEWS.CLIENTE ? (
          <ClientDashboard
            produtos={produtos}
            abrirProduto={abrirProduto}
            produtoSelecionado={produtoSelecionado}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Bottom navigation apenas cliente */}
      {view === VIEWS.CLIENTE && <BottomNav />}
    </div>
  );
}

function SearchInput({ placeholder = "Pesquisar" }) {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-100">
        <span className="text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
        />
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      <button className="text-[11px] font-medium text-gray-500">
        Ver tudo
      </button>
    </div>
  );
}

function ClientDashboard({
  produtos,
  abrirProduto,
  produtoSelecionado,
  modalOpen,
  setModalOpen,
}) {
  return (
    <>
      <SearchInput placeholder="Buscar produtos" />

      <div className="grid grid-cols-2 gap-3">
        {produtos.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            onClick={abrirProduto}
          />
        ))}
      </div>

      <ProductModal
        produto={produtoSelecionado}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

function StatCard({ label, value, sublabel }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-[#ffe1e6] mb-2" />
      <p className="text-[11px] text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#8E000C]">{value}</p>
      {sublabel && <p className="text-[10px] text-gray-400 mt-1">{sublabel}</p>}
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) {
    return <p className="text-sm text-gray-500">Carregando dados...</p>;
  }
  return (
    <>
      <SearchInput placeholder="Pesquisar produtos, clientes..." />

      {/* Cards de resumo */}
      {/* <section className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          label="Total em Vendas Hoje"
          value={`R$ ${stats.vendasHoje.toFixed(2)}`}
        />
        <StatCard label="Total de Produtos" value={stats.totalProdutos} />
        <StatCard label="Lucro Líquido Hoje" value="R$ 1.234,00" />
        <StatCard label="Itens em Estoque" value={stats.itensEstoque} />
      </section> */}

      {/* Gráfico simples */}
      <div className="mb-6">
        
        <KpiCards/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        <div className="lg:col-span-2">
          <GraficoLucro/>
        </div>

        <ProdutosMaisVendidos/>

      </div>

      <PedidosRecentes/>


      {/* Tabela de produtos vendidos */}
      {/* <section className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-800">
            Produtos Vendidos
          </h2>
          <button className="text-[11px] text-gray-500 font-medium">
            Ver todos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="text-gray-400 border-b">
                <th className="py-1.5 pr-2 font-medium">Nome</th>
                <th className="py-1.5 pr-2 font-medium">Categoria</th>
                <th className="py-1.5 pr-2 font-medium">Quant.</th>
                <th className="py-1.5 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.produtosVendidos.map((p, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-1.5 pr-2 text-gray-700">{p.nome}</td>
                  <td className="py-1.5 pr-2 text-gray-500">{p.categoria}</td>
                  <td className="py-1.5 pr-2 text-gray-700">{p.quantidade}</td>
                  <td className="py-1.5 text-right text-[#8E000C] font-semibold">
                    R$ {p.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section> */}
    </>
  );
}
