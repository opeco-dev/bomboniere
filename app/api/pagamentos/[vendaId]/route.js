"use client"

import { useEffect, useState } from "react"

export default function PagamentoPix({ params }) {

  const [qr, setQr] = useState(null)

  useEffect(() => {

    async function gerar() {

      const res = await fetch("/api/pagamentos/pix", {
        method: "POST",
        body: JSON.stringify({
          vendaId: params.vendaId
        })
      })

      const data = await res.json()

      setQr(data.qr)

    }

    gerar()

  }, [])

  if (!qr) return <p>Gerando PIX...</p>

  return (

    <div className="p-6 text-center">

      <h1 className="text-lg font-semibold mb-4">
        Pague com PIX
      </h1>

      <img src={`data:image/png;base64,${qr}`} />

      <p className="mt-4 text-sm">
        Escaneie o QRCode para pagar
      </p>

    </div>

  )

}