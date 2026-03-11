import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req) {

  const body = await req.json()
    console.log("Webhook recebido:", body)

  const paymentId = body.data?.id

  if (!paymentId) {
    return NextResponse.json({ ok: true })
  }

  const venda = await prisma.venda.findFirst({
    where: {
      pagamentoId: String(paymentId)
    }
  })

  if (!venda) {
    return NextResponse.json({ ok: true })
  }

  await prisma.venda.update({
    where: { id: venda.id },
    data: {
      status: "pago"
    }
  })

  return NextResponse.json({ ok: true })
}