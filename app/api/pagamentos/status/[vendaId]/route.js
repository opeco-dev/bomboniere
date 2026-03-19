import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const venda = await prisma.venda.findUnique({
    where: { id: params.vendaId },
    select: {
      status: true,
      cliente: {
        select: {
          usuarioId: true,
        },
      },
    },
  });

  if (!venda) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 },
    );
  }

  if (session.user.role !== "admin" && venda.cliente?.usuarioId !== session.user.id) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  return NextResponse.json({
    status: venda.status,
  });
}
