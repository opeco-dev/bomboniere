import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const pedido = await prisma.venda.findUnique({
      where: {
        id: params.id,
      },

      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Erro buscar pedido:", error);

    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
