// src/app/api/produtos/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      where: { ativo: true },
      include: {
        imagens: true,
        estoque: true,
      },
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        preco: parseFloat(body.preco),
        custoUnit: parseFloat(body.custoUnit),
        estoqueMin: parseInt(body.estoqueMin),
        categoria: body.categoria,
        unidade: body.unidade || 'un',

        estoque: {
          create: {
            quantidade: parseInt(body.quantidadeInicial || 0)
          }
        },

        imagens: body.imagens && body.imagens.length > 0
          ? {
              create: body.imagens.map(url => ({
                url
              }))
            }
          : undefined
      },
      include: {
        imagens: true,
        estoque: true
      }
    });

    return NextResponse.json(produto, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar produto:', error);

    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}