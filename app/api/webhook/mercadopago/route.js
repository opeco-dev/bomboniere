import { prisma } from "@/app/lib/prisma";
import client from "@/app/lib/mercadopago";
import { Payment } from "mercadopago";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const url = new URL(req.url);

    const paymentId = url.searchParams.get("data.id");

    const type = url.searchParams.get("type");

    if (type !== "payment" || !paymentId) {
      return NextResponse.json({ ok: true });
    }

    const paymentClient = new Payment(client);

    const payment = await paymentClient.get({
      id: paymentId,
    });

    if (payment.status === "approved") {
      const venda = await prisma.venda.findUnique({
        where: {
          pagamentoId: String(payment.id),
        },
      });

      if (!venda) {
        console.log("Venda não encontrada:", payment.id);
        return NextResponse.json({ ok: true });
      }

      await prisma.venda.update({
        where: { id: venda.id },
        data: { status: "pago" },
      });

      await prisma.contaReceber.updateMany({
        where: { vendaId: venda.id },
        data: {
          status: "pago",
          saldo: 0,
        },
      });

      console.log("Pagamento confirmado:", venda.id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook erro:", error);

    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
