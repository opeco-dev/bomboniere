import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const venda = await prisma.venda.findUnique({
    where: { id: params.vendaId },
    select: {
      status: true,
    },
  });

  if (!venda) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    status: venda.status,
  });
}
