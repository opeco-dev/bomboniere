"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductImageUpload from "../components/ui/products/ProductImageUpload";
import ProductEditModal from '../components/ui/products/ProductEditModal';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
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
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Produto criado com sucesso!");
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
        });
        fetchProdutos();
      } else {
        alert("Erro ao criar produto");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar produto");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:underline mb-2 block"
            >
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            {showForm ? "Cancelar" : "+ Novo Produto"}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Novo Produto</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold mb-2">
                  Imagens do Produto
                </label>

                <ProductImageUpload
                  onUpload={(urls) => {
                    setImages(urls);
                    setFormData((prev) => ({
                      ...prev,
                      imagens: urls,
                    }));
                  }}
                />

                {images.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Categoria *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option disabled>Selecione a Categoria</option>
                  <option value="Doce">Doce</option>
                  <option value="Bebida">Bebida</option>
                  <option value="Salgado">Salgado</option>
                  <option value="Sorvete">Sorvete</option>
                  <option value="Chocolate">Chocolate</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Preço de Venda (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Custo Unitário (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="custoUnit"
                  value={formData.custoUnit}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Estoque Mínimo *
                </label>
                <input
                  type="number"
                  name="estoqueMin"
                  value={formData.estoqueMin}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Unidade *
                </label>
                <select
                  name="unidade"
                  value={formData.unidade}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="un">Unidade</option>
                  <option value="kg">Quilograma</option>
                  <option value="g">Grama</option>
                  <option value="caixa">Caixa</option>
                  <option value="pacote">Pacote</option>
                  <option value="litro">Litro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Quantidade Inicial
                </label>
                <input
                  type="number"
                  name="quantidadeInicial"
                  value={formData.quantidadeInicial}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Produtos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  Custo
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  Mín.
                </th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhum produto cadastrado
                  </td>
                </tr>
              ) : (
                produtos.map((produto) => {
                  const estoqueTotal = produto.estoque.reduce(
                    (sum, e) => sum + e.quantidade,
                    0,
                  );
                  const estoqueAbaixoMinimo = estoqueTotal < produto.estoqueMin;

                  return (
                    <tr key={produto.id} onClick={() => setSelectedProduto(produto)} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{produto.nome}</div>
                        <div className="text-sm text-gray-600">
                          {produto.descricao}
                        </div>
                      </td>
                      <td className="px-6 py-4">{produto.categoria}</td>
                      <td className="px-6 py-4 font-semibold">
                        R$ {produto.preco.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        R$ {produto.custoUnit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold ${estoqueAbaixoMinimo ? "text-red-600" : "text-green-600"}`}
                        >
                          {estoqueTotal} {produto.unidade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {produto.estoqueMin}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {selectedProduto && (
          <ProductEditModal
            produto={selectedProduto}
            onClose={() => setSelectedProduto(null)}
            onUpdate={() => fetchProdutos()}
          />
        )}
      </div>
    </div>
  );
}
