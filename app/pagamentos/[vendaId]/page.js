"use client";

import { useEffect, useState } from "react";

export default function PagamentoPix({ params }) {
  const [qr, setQr] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function gerar() {
      try {
        const res = await fetch("/api/pagamentos/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendaId: params.vendaId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Erro ao gerar PIX");
          return;
        }

        setQr(data.qrBase64);
      } catch (e) {
        setError("Erro ao gerar PIX");
      }
    }

    gerar();
  }, [params.vendaId]);

  if (error) return <p className="p-6 text-center text-sm text-red-600">{error}</p>;
  if (!qr) return <p className="p-6 text-center text-sm">Gerando PIX...</p>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-lg font-semibold mb-4">Pague com PIX</h1>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="QRCode PIX" src={`data:image/png;base64,${qr}`} className="mx-auto" />

      <p className="mt-4 text-sm">Escaneie o QRCode para pagar</p>
    </div>
  );
}

