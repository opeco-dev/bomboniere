"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import ProductRelatedCard from "./ProductRelatedCard";

export default function ProductModal({ produto, open, onClose }) {
  const [index, setIndex] = useState(0);
  const [relacionados, setRelacionados] = useState([]);
  const [produtoAtual, setProdutoAtual] = useState(produto);
  const [variacaoSelecionada, setVariacaoSelecionada] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    setProdutoAtual(produto || null);
  }, [produto]);

  useEffect(() => {
    if (!produtoAtual) {
      setVariacaoSelecionada(null);
      setIndex(0);
      return;
    }

    const variacoes = Array.isArray(produtoAtual.variacoes)
      ? produtoAtual.variacoes
      : [];

    setVariacaoSelecionada(variacoes[0] || null);
    setIndex(0);
  }, [produtoAtual]);

  useEffect(() => {
    if (!produtoAtual?.id || !produtoAtual?.categoria) return;

    fetch(
      `/api/produtos/relacionados?categoria=${produtoAtual.categoria}&produtoId=${produtoAtual.id}`,
    )
      .then((res) => res.json())
      .then((data) => setRelacionados(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error("Erro ao buscar relacionados:", error);
        setRelacionados([]);
      });
  }, [produtoAtual]);

  const variacoes = useMemo(() => {
    return Array.isArray(produtoAtual?.variacoes) ? produtoAtual.variacoes : [];
  }, [produtoAtual]);

  const imagens = useMemo(() => {
    if (variacaoSelecionada?.imagens?.length > 0) {
      return variacaoSelecionada.imagens;
    }

    return Array.isArray(produtoAtual?.imagens) ? produtoAtual.imagens : [];
  }, [produtoAtual, variacaoSelecionada]);

  const estoqueProduto = useMemo(() => {
    const estoque = Array.isArray(produtoAtual?.estoque)
      ? produtoAtual.estoque
      : [];
    return estoque.reduce(
      (sum, item) => sum + Number(item?.quantidade || 0),
      0,
    );
  }, [produtoAtual]);

  const estoqueVariacao = useMemo(() => {
    const estoque = Array.isArray(variacaoSelecionada?.estoque)
      ? variacaoSelecionada.estoque
      : [];

    return estoque.reduce(
      (sum, item) => sum + Number(item?.quantidade || 0),
      0,
    );
  }, [variacaoSelecionada]);

  const precoAtual = Number(
    variacaoSelecionada?.preco ?? produtoAtual?.preco ?? 0,
  ).toFixed(2);

  const estoqueAtual = variacaoSelecionada ? estoqueVariacao : estoqueProduto;

  if (!open || !produtoAtual) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-[90%] max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <ChevronLeft className="mb-5 cursor-pointer" onClick={onClose} />

        {imagens.length > 0 && (
          <div className="mb-4">
            <img
              src={imagens[index]?.url}
              alt="imagem-principal"
              className="w-full h-48 object-contain rounded-xl"
            />

            <div className="flex gap-2 mt-2 overflow-x-auto">
              {imagens.map((img, i) => (
                <img
                  key={img.id || i}
                  src={img.url}
                  alt={`imagem-${i}`}
                  onClick={() => setIndex(i)}
                  className={`w-16 h-16 rounded-lg object-contain cursor-pointer border ${
                    index === i ? "border-[#8E000C]" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex flex-row gap-2 items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
              {produtoAtual.nome}
            </h2>

            <div className="flex gap-1 text-sm">
              <span>Estoque</span>
              <span>{estoqueAtual}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">
              {produtoAtual.categoria}
            </span>

            <span className="font-semibold text-[#8E000C]">
              R$ {precoAtual}
            </span>
          </div>
        </div>

        {variacoes.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Sabores</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {variacoes.map((variacao) => {
                const active = variacaoSelecionada?.id === variacao.id;

                return (
                  <button
                    key={variacao.id}
                    type="button"
                    onClick={() => {
                      setVariacaoSelecionada(variacao);
                      setIndex(0);
                    }}
                    className={`px-3 py-2 rounded-full border text-sm transition ${
                      active
                        ? "bg-[#8E000C] text-white border-[#8E000C]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#8E000C]"
                    }`}
                  >
                    {variacao.sabor}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5">
          <span className="font-semibold">Descrição</span>
          <p className="text-sm text-gray-500 mt-1">{produtoAtual.descricao}</p>
        </div>

        {relacionados.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Produtos relacionados</h3>

            <div className="flex gap-3 overflow-x-auto">
              {relacionados.map((p) => (
                <ProductRelatedCard
                  key={p.id}
                  produto={p}
                  onClick={(novoProduto) => {
                    setProdutoAtual(novoProduto);
                    setIndex(0);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <button
          className="mt-6 w-full bg-[#8E000C] text-white py-2 rounded-full"
          onClick={() => {
            addToCart({
              ...produtoAtual,
              preco: Number(variacaoSelecionada?.preco ?? produtoAtual.preco),
              variacaoId: variacaoSelecionada?.id || null,
              sabor: variacaoSelecionada?.sabor || null,
              nomeCarrinho: variacaoSelecionada?.sabor
                ? `${produtoAtual.nome} - ${variacaoSelecionada.sabor}`
                : produtoAtual.nome,
              imagem:
                imagens?.[0]?.url || produtoAtual.imagens?.[0]?.url || null,
            });

            onClose();
          }}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
