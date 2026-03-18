// src/app/api/produtos/relacionados/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria");
    const produtoId = Number(searchParams.get("produtoId"));

    const produtos = await prisma.produto.findMany({
      where: {
        ativo: true,
        categoria,
        id: {
          not: produtoId,
        },
      },
      include: {
        imagens: true,
        estoque: {
          where: { variacaoId: null },
        },
        variacoes: {
          where: { ativo: true },
          include: {
            imagens: true,
            estoque: true,
          },
          orderBy: { sabor: "asc" },
        },
      },
      take: 10,
      orderBy: { nome: "asc" },
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos relacionados:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos relacionados" },
      { status: 500 },
    );
  }
}
