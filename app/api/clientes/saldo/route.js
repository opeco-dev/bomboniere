import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ saldo: 0 });
  }

  const cliente = await prisma.cliente.findUnique({
    where: {
      usuarioId: session.user.id,
    },
  });

  if (!cliente) {
    return NextResponse.json({ saldo: 0 });
  }

  const vendas = await prisma.venda.aggregate({
    where: {
      clienteId: cliente.id,
      status: "aberta",
    },
    _sum: {
      total: true,
    },
  });

  const saldo = vendas._sum.total || 0;

  return NextResponse.json({ saldo });
}
