// src/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🍬 Bomboniere Orlando
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Sistema de gestão de estoque e vendas.
        </p>

        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Link
            href="/login"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition"
          >
            Entrar no sistema
          </Link>

          <Link
            href="/dashboard"
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-xl border border-gray-200 transition"
          >
            Ver dashboard (se já estiver logado)
          </Link>
        </div>
      </div>
    </div>
  );
}
