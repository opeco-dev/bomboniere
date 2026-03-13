import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

      return {
        nome: produto.nome,
        preco: produto.preco,
        vendas: p._sum.quantidade,
      };
    }),
  );

  return NextResponse.json(resultado);
}
