import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const body = await req.json();
  const id = parseInt(params.id);

  try {
    const produto = await prisma.produto.update({
      where: { id },
      data: {
        nome: body.nome,
        descricao: body.descricao,
        preco: parseFloat(body.preco),
        custoUnit: parseFloat(body.custoUnit),
        categoria: body.categoria,
        unidade: body.unidade,
        estoqueMin: parseInt(body.estoqueMin),
      },
    });

    // atualizar validade no estoque
    if (body.dataValidade) {
      const estoque = await prisma.estoque.findFirst({
        where: { produtoId: id },
      });

      if (estoque) {
        await prisma.estoque.update({
          where: { id: estoque.id },
          data: {
            dataValidade: new Date(body.dataValidade),
          },
        });
      }
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 },
    );
  }
}
