import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const produtos = await prisma.itemVenda.groupBy({
      by: ["produtoId"],
      _sum: { quantidade: true },
      orderBy: {
        _sum: { quantidade: "desc" },
      },
      take: 5,
    });

    const resultado = await Promise.all(
      produtos.map(async (p) => {
        const produto = await prisma.produto.findUnique({
          where: { id: p.produtoId },
        });

        if (!produto) return null;

        return {
          nome: produto.nome,
          preco: produto.preco,
          vendas: p._sum.quantidade,
        };
      }),
    );

    return NextResponse.json(resultado.filter(Boolean));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 },
    );
  }
}
