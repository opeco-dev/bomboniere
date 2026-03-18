import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

function normalizeImages(images = []) {
  return images
    .map((img) => {
      if (typeof img === "string") {
        return { url: img, fileKey: null };
      }

      return {
        url: img?.url || "",
        fileKey: img?.fileKey || null,
      };
    })
    .filter((img) => img.url);
}

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      where: { ativo: true },
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

    const variacoes = Array.isArray(body.variacoes)
      ? body.variacoes.filter((v) => v?.sabor?.trim())
      : [];

    const imagensProduto = normalizeImages(body.imagens || []);

    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        descricao: body.descricao || null,
        preco: parseFloat(body.preco || 0),
        custoUnit: parseFloat(body.custoUnit || 0),
        estoqueMin: parseInt(body.estoqueMin || 0),
        categoria: body.categoria,
        unidade: body.unidade || "un",

        imagens: imagensProduto.length
          ? {
              create: imagensProduto.map((img) => ({
                url: img.url,
                fileKey: img.fileKey,
              })),
            }
          : undefined,

        variacoes: variacoes.length
          ? {
              create: variacoes.map((variacao) => {
                const imagensVariacao = normalizeImages(variacao.imagens || []);

                return {
                  sabor: variacao.sabor.trim(),
                  preco: variacao.preco ? parseFloat(variacao.preco) : null,
                  imagens: imagensVariacao.length
                    ? {
                        create: imagensVariacao.map((img) => ({
                          url: img.url,
                          fileKey: img.fileKey,
                        })),
                      }
                    : undefined,
                  estoque: {
                    create: {
                      produtoId: undefined,
                      quantidade: parseInt(variacao.quantidadeInicial || 0),
                      lote: variacao.lote || null,
                      localizacao: variacao.localizacao || null,
                      dataValidade: variacao.dataValidade
                        ? new Date(variacao.dataValidade)
                        : null,
                    },
                  },
                };
              }),
            }
          : undefined,

        estoque: variacoes.length
          ? undefined
          : {
              create: {
                quantidade: parseInt(body.quantidadeInicial || 0),
                lote: body.lote || null,
                localizacao: body.localizacao || null,
                dataValidade: body.dataValidade
                  ? new Date(body.dataValidade)
                  : null,
              },
            },
      },
      include: {
        imagens: true,
        estoque: {
          where: { variacaoId: null },
        },
        variacoes: {
          include: {
            imagens: true,
            estoque: true,
          },
          orderBy: { sabor: "asc" },
        },
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);

    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 },
    );
  }
}
