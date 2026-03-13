import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const pedidos = await prisma.venda.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      cliente: true,
      itens: true,
    },
  });

  return NextResponse.json(pedidos);
}
