"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "../components/ui/AdminSideBar";
import ProductImageUpload from "../components/ui/products/ProductImageUpload";
import ProductEditModal from "../components/ui/products/ProductEditModal";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);

  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    custoUnit: "",
    estoqueMin: "",
    categoria: "",
    unidade: "un",
    quantidadeInicial: "0",
    imagens: [],
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const res = await fetch("/api/produtos");
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const pegarValidadeMaisProxima = (estoque) => {
    if (!estoque || estoque.length === 0) return null;

    const comValidade = estoque.filter((e) => e.dataValidade);

    if (comValidade.length === 0) return null;

    const maisProxima = comValidade.sort(
      (a, b) => new Date(a.dataValidade) - new Date(b.dataValidade),
    )[0];

    return maisProxima.dataValidade;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setImages([]);

        setFormData({
          nome: "",
          descricao: "",
          preco: "",
          custoUnit: "",
          estoqueMin: "",
          categoria: "",
          unidade: "un",
          quantidadeInicial: "0",
          imagens: [],
        });

        fetchProdutos();
      } else {
        alert("Erro ao criar produto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AdminSidebar />
            <h1 className="text-2xl md:text-3xl font-bold">Produtos</h1>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-[#8E000C] hover:bg-[#6d0009] text-white font-semibold px-4 py-2 rounded-full"
          >
            + Novo Produto
          </button>
        </div>

        {/* TABELA DESKTOP */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Produto</th>
                <th className="px-6 py-3 text-left">Categoria</th>
                <th className="px-6 py-3 text-left">Preço</th>
                <th className="px-6 py-3 text-left">Custo</th>
                <th className="px-6 py-3 text-left">Estoque</th>
                <th className="px-6 py-3 text-left">Validade</th>
              </tr>
            </thead>

            <tbody>
              {produtos.map((produto) => {
                const estoqueTotal = produto.estoque.reduce(
                  (sum, e) => sum + e.quantidade,
                  0,
                );

                const validade = pegarValidadeMaisProxima(produto.estoque);

                return (
                  <tr
                    key={produto.id}
                    onClick={() => setSelectedProduto(produto)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold">{produto.nome}</td>

                    <td className="px-6 py-4">{produto.categoria}</td>

                    <td className="px-6 py-4">R$ {produto.preco.toFixed(2)}</td>

                    <td className="px-6 py-4">
                      R$ {produto.custoUnit.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      {estoqueTotal} {produto.unidade}
                    </td>

                    <td className="px-6 py-4">{formatarData(validade)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden flex flex-col gap-3">
          {produtos.map((produto) => {
            const estoqueTotal = produto.estoque.reduce(
              (sum, e) => sum + e.quantidade,
              0,
            );

            const validade = pegarValidadeMaisProxima(produto.estoque);

            return (
              <div
                key={produto.id}
                onClick={() => setSelectedProduto(produto)}
                className="bg-white p-4 rounded-xl shadow"
              >
                <div className="font-semibold text-lg">{produto.nome}</div>

                <div className="text-sm text-gray-600">{produto.categoria}</div>

                <div className="flex justify-between mt-2 text-sm">
                  <span>Preço</span>
                  <span className="font-semibold">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Estoque</span>
                  <span>
                    {estoqueTotal} {produto.unidade}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Validade</span>
                  <span>{formatarData(validade)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedProduto && (
          <ProductEditModal
            produto={selectedProduto}
            onClose={() => setSelectedProduto(null)}
            onUpdate={fetchProdutos}
          />
        )}
      </div>
    </div>
  );
}
