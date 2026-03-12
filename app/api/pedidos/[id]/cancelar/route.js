import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const id = params.id;

  const venda = await prisma.venda.findUnique({
    where: { id },
    include: {
      contas: true,
    },
  });

  if (!venda) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 },
    );
  }

  // se estiver ativo → cancelar
  if (venda.ativo) {
    await prisma.venda.update({
      where: { id },
      data: {
        ativo: false,
        status: "cancelado",
      },
    });

    await prisma.contaReceber.updateMany({
      where: { vendaId: id },
      data: {
        status: "cancelado",
        saldo: 0,
      },
    });
  } else {
    // reativar pedido
    await prisma.venda.update({
      where: { id },
      data: {
        ativo: true,
        status: "aberta",
      },
    });

    await prisma.contaReceber.updateMany({
      where: { vendaId: id },
      data: {
        status: "pendente",
      },
    });
  }

  return NextResponse.json({ success: true });
}
