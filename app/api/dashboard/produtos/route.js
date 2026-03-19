import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

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
