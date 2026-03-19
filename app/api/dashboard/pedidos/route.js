import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

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
