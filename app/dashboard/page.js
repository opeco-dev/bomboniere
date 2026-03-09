'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const VIEWS = {
  CLIENTE: 'cliente',
  ADMIN: 'admin',
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
        <span className="text-sm text-gray-600">Carregando seu painel...</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

  const role = session?.user?.role || 'user';
  const view = role === 'admin' ? VIEWS.ADMIN : VIEWS.CLIENTE;

  const roleLabel = role === 'admin' ? 'Administrador' : 'Cliente';

  return (
    <div className="min-h-screen bg-[#fff5f7] flex flex-col">
      {/* Top bar */}
      <header className="px-4 pt-4 pb-3 flex items-center justify-between bg-white shadow-sm">
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700">
          ☰
        </button>

        <div className="flex-1 mx-3">
          {view === VIEWS.CLIENTE ? (
            <>
              <p className="text-xs text-gray-500 font-medium">Saldo Devedor</p>
              <p className="text-xl font-semibold text-[#8E000C] -mt-0.5">R$ -4,70</p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500 font-medium">Dashboard</p>
              <p className="text-lg font-semibold text-gray-800 -mt-0.5">
                Visão geral
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {roleLabel}
          </span>
          <button
            type="button"
            onClick={() => router.replace('/login')}
            className="text-[10px] text-gray-400 hover:text-gray-600"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-3">
        {view === VIEWS.CLIENTE ? <ClientDashboard /> : <AdminDashboard />}
      </main>

      {/* Bottom navigation (fixo) */}
      <BottomNav />
    </div>
  );
}

function SearchInput({ placeholder = 'Pesquisar' }) {
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
      <button className="text-[11px] font-medium text-gray-500">Ver tudo</button>
    </div>
  );
}

function ProductCard({ name, category, price }) {
  return (
    <div className="w-40 shrink-0 bg-white rounded-2xl p-3 shadow-sm mr-3">
      <div className="w-full h-20 rounded-xl bg-[#ffe1e6] mb-3" />

      <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">{name}</p>
      <p className="text-[11px] text-gray-500 mb-2">{category}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#8E000C]">R$ {price}</span>
        <button className="w-7 h-7 rounded-full bg-red-500 text-white text-base flex items-center justify-center shadow">
          +
        </button>
      </div>
    </div>
  );
}

function ClientDashboard() {
  return (
    <>
      <SearchInput placeholder="Buscar produtos" />

      {/* Seção Bebidas */}
      <section className="mb-4">
        <SectionHeader title="Bebidas" />
        <div className="flex overflow-x-auto pb-1 -mx-1 px-1">
          <ProductCard name="Monster 473ml" category="Refrigerante" price="10,00" />
          <ProductCard name="Coca 150ml" category="Refrigerante" price="5,00" />
          <ProductCard name="Suco de Laranja" category="Bebida" price="6,50" />
        </div>
      </section>

      {/* Seção Doces */}
      <section className="mb-4">
        <SectionHeader title="Doces" />
        <div className="flex overflow-x-auto pb-1 -mx-1 px-1">
          <ProductCard name="Fini Bananas" category="Balas" price="5,00" />
          <ProductCard name="Chocolate Crunch" category="Chocolate" price="10,00" />
          <ProductCard name="Trento 32g" category="Chocolate" price="4,50" />
        </div>
      </section>

      {/* Seção Snacks */}
      <section className="mb-4">
        <SectionHeader title="Snacks" />
        <div className="flex overflow-x-auto pb-1 -mx-1 px-1">
          <ProductCard name="Ruffles 90g" category="Salgadinhos" price="8,00" />
          <ProductCard name="Pipoca Doce" category="Snacks" price="4,00" />
        </div>
      </section>
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

function MiniBarChart({ values }) {

  return (
    <div className="flex items-end gap-1 h-32">
      {values.map((v, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-full bg-[#ffd4dd]"
          style={{ height: `${v * 4}px` }}
        />
      ))}
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  if (!stats) {
    return <p className="text-sm text-gray-500">Carregando dados...</p>
  }
  return (
    <>
      <SearchInput placeholder="Pesquisar produtos, clientes..." />

      {/* Cards de resumo */}
      <section className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="Total em Vendas Hoje" value={`R$ ${stats.vendasHoje.toFixed(2)}`} />
        <StatCard label="Total de Produtos" value={stats.totalProdutos} />
        <StatCard label="Lucro Líquido Hoje" value="R$ 1.234,00" />
        <StatCard label="Itens em Estoque" value={stats.itensEstoque}
      />
      </section>

      {/* Gráfico simples */}
      <section className="bg-white rounded-2xl p-3 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-800">Total em Vendas</h2>
          <span className="text-xs text-[#8E000C] font-semibold">R$ 1.234,00</span>
        </div>

        <div className="flex items-center justify-between mb-3 gap-1">
          <button className="px-3 py-1 rounded-full text-[11px] font-semibold bg-red-500 text-white">
            Hoje
          </button>
          <button className="px-3 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
            7d
          </button>
          <button className="px-3 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
            30d
          </button>
          <button className="px-3 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
            12m
          </button>
        </div>

        <MiniBarChart values={[12,18,10,20,14,17,19]}/>
      </section>

      {/* Tabela de produtos vendidos */}
      <section className="bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-800">Produtos Vendidos</h2>
          <button className="text-[11px] text-gray-500 font-medium">Ver todos</button>
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
      </section>
    </>
  );
}

function BottomNav() {
  const items = [
    { href: '/dashboard', label: 'Início', icon: '🏠' },
    { href: '', label: 'Dash', icon: '📊' },
    { href: '/produtos', label: 'Produtos', icon: '📦' },
    { href: '/clientes', label: 'Clientes', icon: '👥' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-2.5 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center justify-center text-[10px] text-gray-500"
        >
          <span className="text-lg mb-0.5">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

