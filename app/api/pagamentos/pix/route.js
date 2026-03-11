import { Payment } from "mercadopago";
import client from "../../../lib/mercadopago";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const venda = await prisma.venda.findUnique({
      where: { id: body.vendaId },
    });

    if (!venda) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 },
      );
    }
    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: Number(venda.total),
        description: `Pedido ${venda.id}`,
        payment_method_id: "pix",
        payer: {
          email: "cliente@email.com",
        },
      },
    });

    // salvar id do pagamento na venda
    await prisma.venda.update({
      where: { id: venda.id },
      data: {
        pagamentoId: String(result.id),
      },
    });

    const pixData = result.point_of_interaction.transaction_data;

    return NextResponse.json({
      qrBase64: pixData.qr_code_base64,
      copiaCola: pixData.qr_code,
      link: pixData.ticket_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Erro gerar PIX" }, { status: 500 });
  }
}
