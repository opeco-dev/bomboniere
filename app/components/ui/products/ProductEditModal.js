"use client";

import { useEffect, useMemo, useState } from "react";
import ProductImageUpload from "./ProductImageUpload";

const normalizeImages = (images = []) => {
  return images
    .map((img) => {
      if (typeof img === "string") {
        return {
          url: img,
          fileKey: null,
        };
      }

      return {
        url: img?.url || "",
        fileKey: img?.fileKey || null,
      };
    })
    .filter((img) => img.url);
};

const getInitialFormData = () => ({
  nome: "",
  categoria: "",
  descricao: "",
  preco: "",
  custoUnit: "",
  estoqueMin: "",
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

export default function ProductEditModal({ produto, onClose, onUpdate }) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!produto) return;

    const estoquePrincipal = Array.isArray(produto.estoque)
      ? produto.estoque[0]
      : null;

    setFormData({
      nome: produto.nome || "",
      categoria: produto.categoria || "",
      descricao: produto.descricao || "",
      preco: produto.preco?.toString?.() || "",
      custoUnit: produto.custoUnit?.toString?.() || "",
      estoqueMin: produto.estoqueMin?.toString?.() || "0",
      unidade: produto.unidade || "un",
      quantidadeInicial: estoquePrincipal?.quantidade?.toString?.() || "0",
      dataValidade: estoquePrincipal?.dataValidade
        ? new Date(estoquePrincipal.dataValidade).toISOString().split("T")[0]
        : "",
      lote: estoquePrincipal?.lote || "",
      localizacao: estoquePrincipal?.localizacao || "",
      imagens: normalizeImages(produto.imagens || []),
      variacoes: Array.isArray(produto.variacoes)
        ? produto.variacoes.map((variacao) => {
            const estoqueVariacao = Array.isArray(variacao.estoque)
              ? variacao.estoque[0]
              : null;

            return {
              id: variacao.id,
              sabor: variacao.sabor || "",
              preco:
                variacao.preco === null || variacao.preco === undefined
                  ? ""
                  : variacao.preco.toString(),
              quantidadeInicial:
                estoqueVariacao?.quantidade?.toString?.() || "0",
              dataValidade: estoqueVariacao?.dataValidade
                ? new Date(estoqueVariacao.dataValidade)
                    .toISOString()
                    .split("T")[0]
                : "",
              lote: estoqueVariacao?.lote || "",
              localizacao: estoqueVariacao?.localizacao || "",
              imagens: normalizeImages(variacao.imagens || []),
            };
          })
        : [],
    });
  }, [produto]);

  const hasVariacoes = formData.variacoes.length > 0;

  const payload = useMemo(() => {
    return {
      nome: formData.nome.trim(),
      categoria: formData.categoria.trim(),
      descricao: formData.descricao.trim(),
      preco: formData.preco,
      custoUnit: formData.custoUnit,
      estoqueMin: formData.estoqueMin,
      unidade: formData.unidade,
      quantidadeInicial: formData.quantidadeInicial,
      dataValidade: formData.dataValidade || null,
      lote: formData.lote?.trim() || null,
      localizacao: formData.localizacao?.trim() || null,
      imagens: normalizeImages(formData.imagens),
      variacoes: formData.variacoes
        .map((variacao) => ({
          id: variacao.id,
          sabor: variacao.sabor.trim(),
          preco: variacao.preco,
          quantidadeInicial: variacao.quantidadeInicial,
          dataValidade: variacao.dataValidade || null,
          lote: variacao.lote?.trim() || null,
          localizacao: variacao.localizacao?.trim() || null,
          imagens: normalizeImages(variacao.imagens),
        }))
        .filter((variacao) => variacao.sabor),
    };
  }, [formData]);

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

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index),
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

  const removeVariacaoImage = (variacaoIndex, imageIndex) => {
    setFormData((prev) => ({
      ...prev,
      variacoes: prev.variacoes.map((item, i) =>
        i === variacaoIndex
          ? {
              ...item,
              imagens: item.imagens.filter((_, imgI) => imgI !== imageIndex),
            }
          : item,
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

  const handleSave = async () => {
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

      const res = await fetch(`/api/produtos/${produto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Erro ao atualizar produto:", errorData);
        alert("Erro ao atualizar produto");
        return;
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao atualizar produto");
    } finally {
      setSaving(false);
    }
  };

  if (!produto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-y-auto max-h-[92vh]">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold">Editar Produto</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="border rounded-2xl p-4">
            <h3 className="font-semibold text-lg mb-3">Imagens do produto</h3>

            {formData.imagens?.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {formData.imagens.map((img, index) => (
                  <div
                    key={img.fileKey || img.url || index}
                    className="relative w-24 h-24"
                  >
                    <img
                      src={img.url || img}
                      alt={`produto-${index}`}
                      className="w-full h-full object-cover rounded border"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-[#8E000C] text-white w-6 h-6 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <ProductImageUpload
              endpoint="productImage"
              value={formData.imagens}
              onChange={handleImagesChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold block mb-1">Nome</label>
              <input
                name="nome"
                value={formData.nome || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-bold block mb-1">Categoria</label>
              <input
                name="categoria"
                value={formData.categoria || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-bold block mb-1">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao || ""}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-bold block mb-1">Preço base</label>
              <input
                name="preco"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-bold block mb-1">Custo</label>
              <input
                name="custoUnit"
                type="number"
                step="0.01"
                min="0"
                value={formData.custoUnit || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-bold block mb-1">
                Estoque mínimo
              </label>
              <input
                name="estoqueMin"
                type="number"
                min="0"
                value={formData.estoqueMin || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-bold block mb-1">Unidade</label>
              <select
                name="unidade"
                value={formData.unidade || "un"}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="un">Unidade</option>
                <option value="kg">Kg</option>
                <option value="caixa">Caixa</option>
              </select>
            </div>
          </div>

          <div className="border rounded-2xl p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="font-semibold text-lg">Sabores / variações</h3>
                <p className="text-sm text-gray-500">
                  Cada sabor pode ter preço, estoque e imagens próprias.
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

            {!hasVariacoes ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-bold block mb-1">
                    Quantidade inicial
                  </label>
                  <input
                    type="number"
                    name="quantidadeInicial"
                    min="0"
                    value={formData.quantidadeInicial || ""}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-1">Lote</label>
                  <input
                    type="text"
                    name="lote"
                    value={formData.lote || ""}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-1">
                    Validade
                  </label>
                  <input
                    type="date"
                    name="dataValidade"
                    value={formData.dataValidade || ""}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold block mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    name="localizacao"
                    value={formData.localizacao || ""}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                Como este produto possui variações, o estoque principal não será
                usado; cada sabor terá seu próprio estoque.
              </div>
            )}

            <div className="flex flex-col gap-4">
              {formData.variacoes.map((variacao, index) => (
                <div
                  key={variacao.id || index}
                  className="border rounded-2xl p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h4 className="font-semibold">Variação {index + 1}</h4>

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
                      <label className="text-sm font-bold block mb-1">
                        Sabor
                      </label>
                      <input
                        type="text"
                        value={variacao.sabor || ""}
                        onChange={(e) =>
                          handleVariacaoChange(index, "sabor", e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                        placeholder="Ex: Mango Loco"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold block mb-1">
                        Preço da variação
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={variacao.preco || ""}
                        onChange={(e) =>
                          handleVariacaoChange(index, "preco", e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                        placeholder="Opcional"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold block mb-1">
                        Quantidade inicial
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={variacao.quantidadeInicial || ""}
                        onChange={(e) =>
                          handleVariacaoChange(
                            index,
                            "quantidadeInicial",
                            e.target.value,
                          )
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold block mb-1">
                        Lote
                      </label>
                      <input
                        type="text"
                        value={variacao.lote || ""}
                        onChange={(e) =>
                          handleVariacaoChange(index, "lote", e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold block mb-1">
                        Validade
                      </label>
                      <input
                        type="date"
                        value={variacao.dataValidade || ""}
                        onChange={(e) =>
                          handleVariacaoChange(
                            index,
                            "dataValidade",
                            e.target.value,
                          )
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold block mb-1">
                        Localização
                      </label>
                      <input
                        type="text"
                        value={variacao.localizacao || ""}
                        onChange={(e) =>
                          handleVariacaoChange(
                            index,
                            "localizacao",
                            e.target.value,
                          )
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-bold block mb-2">
                      Imagens da variação
                    </label>

                    {variacao.imagens?.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {variacao.imagens.map((img, imageIndex) => (
                          <div
                            key={img.fileKey || img.url || imageIndex}
                            className="relative w-24 h-24"
                          >
                            <img
                              src={img.url || img}
                              alt={`variacao-${index}-${imageIndex}`}
                              className="w-full h-full object-cover rounded border"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeVariacaoImage(index, imageIndex)
                              }
                              className="absolute -top-2 -right-2 bg-[#8E000C] text-white w-6 h-6 rounded-full text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <ProductImageUpload
                      endpoint="productImage"
                      value={variacao.imagens}
                      onChange={(files) => handleVariacaoImages(index, files)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-5 py-3 border rounded-full"
              type="button"
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-3 bg-[#8E000C] text-white rounded-full disabled:opacity-60"
              type="button"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
