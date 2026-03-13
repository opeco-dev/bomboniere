"use client";

import { CheckCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function PagamentoSucesso() {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <CheckCircle size={80} className="text-green-600 mb-6" />

      <h1 className="text-2xl font-bold mb-2">Pagamento aprovado</h1>

      <p className="text-gray-600 text-center mb-6">
        Seu pagamento foi confirmado com sucesso.
      </p>

      <button
        onClick={() => router.push("/pedidos")}
        className="bg-[#8E000C] text-white px-6 py-3 rounded-full"
      >
        Voltar para pedidos
      </button>
    </div>
  );
}
