"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductImageUpload from "./ProductImageUpload";

export default function ProductEditModal({ produto, onClose, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (produto) {
      const validade =
        produto.estoque?.length > 0 ? produto.estoque[0].dataValidade : "";

      setFormData({
        ...produto,
        dataValidade: validade
          ? new Date(validade).toISOString().split("T")[0]
          : "",
        imagens: produto.imagens.map((img) => img.url),
      });

      setImages(produto.imagens.map((img) => img.url));
    }
  }, [produto]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);

    setImages(newImages);

    setFormData({
      ...formData,
      imagens: newImages,
    });
  };

  const handleUpload = (urls) => {
    const newImages = [...images, ...urls];

    setImages(newImages);

    setFormData({
      ...formData,
      imagens: newImages,
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/produtos/${produto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imagens: images,
        }),
      });

      if (res.ok) {
        onUpdate();
        onClose();
      } else {
        alert("Erro ao atualizar produto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!produto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Editar Produto</h2>

          <button onClick={onClose}>✕</button>
        </div>

        {/* IMAGENS */}

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Imagens</h3>

          <div className="flex flex-wrap gap-3 mb-4">
            {images.map((img, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image
                  src={img}
                  alt="produto"
                  fill
                  className="object-contain rounded border"
                />

                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-[#8E000C] text-white w-6 h-6 rounded-full text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <ProductImageUpload onUpload={handleUpload} />
        </div>

        {/* FORM */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold">Nome</label>

            <input
              name="nome"
              value={formData.nome || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Categoria</label>

            <input
              name="categoria"
              value={formData.categoria || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-bold">Descrição</label>

            <textarea
              name="descricao"
              value={formData.descricao || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Preço</label>

            <input
              name="preco"
              type="number"
              value={formData.preco || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Custo</label>

            <input
              name="custoUnit"
              type="number"
              value={formData.custoUnit || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Estoque mínimo</label>

            <input
              name="estoqueMin"
              type="number"
              value={formData.estoqueMin || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Unidade</label>

            <input
              name="unidade"
              value={formData.unidade || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Data de Validade</label>

            <input
              type="date"
              name="dataValidade"
              value={formData.dataValidade}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-full">
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-full"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
