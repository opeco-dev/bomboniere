import { prisma } from "@/app/lib/prisma"
import client from "@/app/lib/mercadopago"
import { Payment } from "mercadopago"
import { NextResponse } from "next/server"

export async function POST(req) {

  const body = await req.json()

  if (body.type !== "payment") {
    return NextResponse.json({ ok: true })
  }

  const paymentClient = new Payment(client)

  const payment = await paymentClient.get({
    id: body.data.id
  })

  if (payment.status === "approved") {

    await prisma.venda.update({
      where: {
        pagamentoId: String(payment.id)
      },
      data: {
        status: "paga"
      }
    })

  }

  return NextResponse.json({ ok: true })

}