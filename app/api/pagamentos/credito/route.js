import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const venda = await prisma.venda.findUnique({
    where: { id: body.vendaId },
  });

  if (!venda) {
    return NextResponse.json(
      { error: "Venda não encontrada" },
      { status: 404 },
    );
  }

  await prisma.contaReceber.create({
    data: {
      vendaId: venda.id,
      clienteId: venda.clienteId,

      valorTotal: venda.total,
      saldo: venda.total,

      parcelas: {
        create: [
          {
            numeroParcela: 1,
            valor: venda.total,
            dataVencimento: new Date(),
          },
        ],
      },
    },
  });

  await prisma.venda.update({
    where: { id: venda.id },
    data: {
      status: "finalizada",
    },
  });

  return NextResponse.json({ ok: true });
}
