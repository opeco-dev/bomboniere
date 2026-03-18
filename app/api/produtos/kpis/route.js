import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      where: { ativo: true },
      include: {
        estoque: true,
        variacoes: {
          where: { ativo: true },
          include: {
            estoque: true,
          },
        },
      },
    });

    const hoje = new Date();
    const limiteCritico = new Date();
    limiteCritico.setDate(hoje.getDate() + 7);

    const totalProdutos = produtos.length;

    const totalEstoque = produtos.reduce((acc, produto) => {
      const estoqueBase = (produto.estoque || []).reduce(
        (sum, item) => sum + Number(item.quantidade || 0),
        0,
      );

      const estoqueVariacoes = (produto.variacoes || []).reduce(
        (sumVariacoes, variacao) =>
          sumVariacoes +
          (variacao.estoque || []).reduce(
            (sumItens, item) => sumItens + Number(item.quantidade || 0),
            0,
          ),
        0,
      );

      return acc + estoqueBase + estoqueVariacoes;
    }, 0);

    const itensEstoqueCritico = produtos.reduce((acc, produto) => {
      const estoqueBase = (produto.estoque || []).reduce(
        (sum, item) => sum + Number(item.quantidade || 0),
        0,
      );

      const variacoesCriticas = (produto.variacoes || []).filter((variacao) => {
        const totalVariacao = (variacao.estoque || []).reduce(
          (sum, item) => sum + Number(item.quantidade || 0),
          0,
        );

        return totalVariacao <= Number(produto.estoqueMin || 0);
      }).length;

      const produtoBaseCritico =
        produto.variacoes?.length > 0
          ? 0
          : estoqueBase <= Number(produto.estoqueMin || 0)
            ? 1
            : 0;

      return acc + produtoBaseCritico + variacoesCriticas;
    }, 0);

    const itensVencimentoCritico = produtos.reduce((acc, produto) => {
      const estoqueBaseCritico = (produto.estoque || []).some((item) => {
        if (!item.dataValidade) return false;
        const validade = new Date(item.dataValidade);
        return validade >= hoje && validade <= limiteCritico;
      })
        ? 1
        : 0;

      const variacoesCriticas = (produto.variacoes || []).filter((variacao) =>
        (variacao.estoque || []).some((item) => {
          if (!item.dataValidade) return false;
          const validade = new Date(item.dataValidade);
          return validade >= hoje && validade <= limiteCritico;
        }),
      ).length;

      return acc + estoqueBaseCritico + variacoesCriticas;
    }, 0);

    return NextResponse.json({
      totalEstoque,
      totalProdutos,
      itensEstoqueCritico,
      itensVencimentoCritico,
    });
  } catch (error) {
    console.error("Erro ao buscar KPIs de produtos:", error);

    return NextResponse.json(
      { error: "Erro ao buscar KPIs de produtos" },
      { status: 500 },
    );
  }
}
