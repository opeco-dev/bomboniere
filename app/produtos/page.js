"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../components/ui/AdminSideBar";
import ProductImageUpload from "../components/ui/products/ProductImageUpload";
import ProductEditModal from "../components/ui/products/ProductEditModal";

const getInitialFormData = () => ({
  nome: "",
  descricao: "",
  preco: "",
  custoUnit: "",
  estoqueMin: "",
  categoria: "",
  unidade: "un",
  quantidadeInicial: "0",
  dataValidade: "",
  lote: "",
  localizacao: "",
  imagens: [],
  variacoes: [],
});

const novaVariacao = () => ({
  sabor: "",
  preco: "",
  quantidadeInicial: "0",
  dataValidade: "",
  lote: "",
  localizacao: "",
  imagens: [],
});

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const res = await fetch("/api/produtos");
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const formatarMoeda = (valor) => {
    const numero = Number(valor || 0);
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const pegarValidadeMaisProxima = (estoque = []) => {
    if (!Array.isArray(estoque) || estoque.length === 0) return null;

    const comValidade = estoque.filter((e) => e?.dataValidade);

    if (comValidade.length === 0) return null;

    const maisProxima = [...comValidade].sort(
      (a, b) => new Date(a.dataValidade) - new Date(b.dataValidade),
    )[0];

    return maisProxima?.dataValidade || null;
  };

  const getEstoqueTotalProduto = (produto) => {
    const estoquePrincipal = Array.isArray(produto?.estoque)
      ? produto.estoque
      : [];
    const totalPrincipal = estoquePrincipal.reduce(
      (sum, item) => sum + Number(item?.quantidade || 0),
      0,
    );

    const variacoes = Array.isArray(produto?.variacoes)
      ? produto.variacoes
      : [];
    const totalVariacoes = variacoes.reduce((acc, variacao) => {
      const estoqueVariacao = Array.isArray(variacao?.estoque)
        ? variacao.estoque
        : [];
      const subtotal = estoqueVariacao.reduce(
        (sum, item) => sum + Number(item?.quantidade || 0),
        0,
      );
      return acc + subtotal;
    }, 0);

    return totalPrincipal + totalVariacoes;
  };

  const getValidadeProduto = (produto) => {
    const estoquePrincipal = Array.isArray(produto?.estoque)
      ? produto.estoque
      : [];
    const variacoes = Array.isArray(produto?.variacoes)
      ? produto.variacoes
      : [];

    const estoqueVariacoes = variacoes.flatMap((variacao) =>
      Array.isArray(variacao?.estoque) ? variacao.estoque : [],
    );

    return pegarValidadeMaisProxima([...estoquePrincipal, ...estoqueVariacoes]);
  };

  const getQtdVariacoes = (produto) => {
    return Array.isArray(produto?.variacoes) ? produto.variacoes.length : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (novasImagens) => {
    setFormData((prev) => ({
      ...prev,
      imagens: novasImagens,
    }));
  };

  const handleVariacaoChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variacoes: prev.variacoes.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleVariacaoImages = (index, novasImagens) => {
    setFormData((prev) => ({
      ...prev,
      variacoes: prev.variacoes.map((item, i) =>
        i === index ? { ...item, imagens: novasImagens } : item,
      ),
    }));
  };

  const addVariacao = () => {
    setFormData((prev) => ({
      ...prev,
      variacoes: [...prev.variacoes, novaVariacao()],
    }));
  };

  const removeVariacao = (index) => {
    setFormData((prev) => ({
      ...prev,
      variacoes: prev.variacoes.filter((_, i) => i !== index),
    }));
  };

  const payload = useMemo(() => {
    const variacoesLimpas = formData.variacoes
      .map((variacao) => ({
        sabor: variacao.sabor.trim(),
        preco: variacao.preco,
        quantidadeInicial: variacao.quantidadeInicial,
        dataValidade: variacao.dataValidade || null,
        lote: variacao.lote?.trim() || null,
        localizacao: variacao.localizacao?.trim() || null,
        imagens: variacao.imagens || [],
      }))
      .filter((variacao) => variacao.sabor);

    return {
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      preco: formData.preco,
      custoUnit: formData.custoUnit,
      estoqueMin: formData.estoqueMin,
      categoria: formData.categoria.trim(),
      unidade: formData.unidade,
      quantidadeInicial: formData.quantidadeInicial,
      dataValidade: formData.dataValidade || null,
      lote: formData.lote?.trim() || null,
      localizacao: formData.localizacao?.trim() || null,
      imagens: formData.imagens || [],
      variacoes: variacoesLimpas,
    };
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !payload.nome ||
      !payload.preco ||
      !payload.custoUnit ||
      !payload.categoria
    ) {
      alert("Preencha nome, preço, custo e categoria.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Erro ao criar produto:", errorData);
        alert("Erro ao criar produto");
        return;
      }

      closeForm();
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao criar produto");
    } finally {
      setSaving(false);
    }
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
        <div className="flex items-center justify-between mb-6 gap-4">
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

        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Produto</th>
                <th className="px-6 py-3 text-left">Categoria</th>
                <th className="px-6 py-3 text-left">Preço</th>
                <th className="px-6 py-3 text-left">Custo</th>
                <th className="px-6 py-3 text-left">Variações</th>
                <th className="px-6 py-3 text-left">Estoque</th>
                <th className="px-6 py-3 text-left">Validade</th>
              </tr>
            </thead>

            <tbody>
              {produtos.map((produto) => {
                const estoqueTotal = getEstoqueTotalProduto(produto);
                const validade = getValidadeProduto(produto);
                const qtdVariacoes = getQtdVariacoes(produto);

                return (
                  <tr
                    key={produto.id}
                    onClick={() => setSelectedProduto(produto)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold">{produto.nome}</td>
                    <td className="px-6 py-4">{produto.categoria}</td>
                    <td className="px-6 py-4">
                      {formatarMoeda(produto.preco)}
                    </td>
                    <td className="px-6 py-4">
                      {formatarMoeda(produto.custoUnit)}
                    </td>
                    <td className="px-6 py-4">
                      {qtdVariacoes > 0 ? `${qtdVariacoes} sabor(es)` : "-"}
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

        <div className="md:hidden flex flex-col gap-3">
          {produtos.map((produto) => {
            const estoqueTotal = getEstoqueTotalProduto(produto);
            const validade = getValidadeProduto(produto);
            const qtdVariacoes = getQtdVariacoes(produto);

            return (
              <div
                key={produto.id}
                onClick={() => setSelectedProduto(produto)}
                className="bg-white p-4 rounded-xl shadow"
              >
                <div className="font-semibold text-lg">{produto.nome}</div>
                <div className="text-sm text-gray-600">{produto.categoria}</div>

                {qtdVariacoes > 0 && (
                  <div className="text-xs text-[#8E000C] mt-1">
                    {qtdVariacoes} sabor(es) cadastrado(s)
                  </div>
                )}

                <div className="flex justify-between mt-2 text-sm">
                  <span>Preço</span>
                  <span className="font-semibold">
                    {formatarMoeda(produto.preco)}
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

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={closeForm} />

            <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-bold">Novo Produto</h2>

                <button
                  type="button"
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                      placeholder="Ex: Monster Energy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Categoria
                    </label>
                    <input
                      type="text"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                      placeholder="Ex: Energético"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Preço
                    </label>
                    <input
                      type="number"
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Custo unitário
                    </label>
                    <input
                      type="number"
                      name="custoUnit"
                      value={formData.custoUnit}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Estoque mínimo
                    </label>
                    <input
                      type="number"
                      name="estoqueMin"
                      value={formData.estoqueMin}
                      onChange={handleChange}
                      min="0"
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Unidade
                    </label>
                    <select
                      name="unidade"
                      value={formData.unidade}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                    >
                      <option value="un">Unidade</option>
                      <option value="kg">Kg</option>
                      <option value="caixa">Caixa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                    placeholder="Descrição do produto"
                  />
                </div>

                <div className="border rounded-2xl p-4">
                  <h3 className="font-semibold text-lg mb-3">
                    Imagens do produto
                  </h3>

                  <ProductImageUpload
                    endpoint="productImage"
                    value={formData.imagens}
                    onChange={handleImagesChange}
                  />

                  {formData.imagens?.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {formData.imagens.map((img, index) => (
                        <img
                          key={img.fileKey || img.url || index}
                          src={img.url || img}
                          alt={`produto-${index}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="border rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Sabores / variações
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ex: Monster Original, Mango Loco, Ultra Violet.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addVariacao}
                      className="bg-[#8E000C] hover:bg-[#6d0009] text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      + Adicionar sabor
                    </button>
                  </div>

                  {formData.variacoes.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Quantidade inicial
                        </label>
                        <input
                          type="number"
                          name="quantidadeInicial"
                          value={formData.quantidadeInicial}
                          onChange={handleChange}
                          min="0"
                          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Lote
                        </label>
                        <input
                          type="text"
                          name="lote"
                          value={formData.lote}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                          placeholder="Opcional"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Validade
                        </label>
                        <input
                          type="date"
                          name="dataValidade"
                          value={formData.dataValidade}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Localização
                        </label>
                        <input
                          type="text"
                          name="localizacao"
                          value={formData.localizacao}
                          onChange={handleChange}
                          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                          placeholder="Ex: prateleira 2"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                      Como este produto possui sabores, o estoque principal não
                      será usado; o estoque ficará em cada variação.
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    {formData.variacoes.map((variacao, index) => (
                      <div
                        key={index}
                        className="border rounded-2xl p-4 bg-gray-50"
                      >
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <h4 className="font-semibold">
                            Variação {index + 1}
                          </h4>

                          <button
                            type="button"
                            onClick={() => removeVariacao(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remover
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Sabor
                            </label>
                            <input
                              type="text"
                              value={variacao.sabor}
                              onChange={(e) =>
                                handleVariacaoChange(
                                  index,
                                  "sabor",
                                  e.target.value,
                                )
                              }
                              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                              placeholder="Ex: Mango Loco"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Preço da variação
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={variacao.preco}
                              onChange={(e) =>
                                handleVariacaoChange(
                                  index,
                                  "preco",
                                  e.target.value,
                                )
                              }
                              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                              placeholder="Opcional"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Quantidade inicial
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={variacao.quantidadeInicial}
                              onChange={(e) =>
                                handleVariacaoChange(
                                  index,
                                  "quantidadeInicial",
                                  e.target.value,
                                )
                              }
                              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Lote
                            </label>
                            <input
                              type="text"
                              value={variacao.lote}
                              onChange={(e) =>
                                handleVariacaoChange(
                                  index,
                                  "lote",
                                  e.target.value,
                                )
                              }
                              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                              placeholder="Opcional"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Validade
                            </label>
                            <input
                              type="date"
                              value={variacao.dataValidade}
                              onChange={(e) =>
                                handleVariacaoChange(
                                  index,
                                  "dataValidade",
                                  e.target.value,
                                )
                              }
                              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Localização
                            </label>
                            <input
                              type="text"
                              value={variacao.localizacao}
                              onChange={(e) =>
                                handleVariacaoChange(
                                  index,
                                  "localizacao",
                                  e.target.value,
                                )
                              }
                              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#8E000C]"
                              placeholder="Ex: geladeira 1"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">
                            Imagens da variação
                          </label>

                          <ProductImageUpload
                            endpoint="productImage"
                            value={variacao.imagens}
                            onChange={(files) =>
                              handleVariacaoImages(index, files)
                            }
                          />

                          {variacao.imagens?.length > 0 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto">
                              {variacao.imagens.map((img, imgIndex) => (
                                <img
                                  key={img.fileKey || img.url || imgIndex}
                                  src={img.url || img}
                                  alt={`variacao-${index}-${imgIndex}`}
                                  className="w-20 h-20 object-cover rounded-lg border"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-5 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                    disabled={saving}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-3 rounded-full bg-[#8E000C] hover:bg-[#6d0009] text-white font-semibold disabled:opacity-60"
                    disabled={saving}
                  >
                    {saving ? "Salvando..." : "Salvar produto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
