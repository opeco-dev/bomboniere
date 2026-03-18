import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

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

export async function PUT(req, { params }) {
  const body = await req.json();
  const id = parseInt(params.id);

  const variacoes = Array.isArray(body.variacoes)
    ? body.variacoes.filter((v) => v?.sabor?.trim())
    : [];

  const imagensProduto = normalizeImages(body.imagens || []);

  try {
    const produto = await prisma.$transaction(async (tx) => {
      const atual = await tx.produto.findUnique({
        where: { id },
        include: {
          variacoes: {
            select: { id: true },
          },
          estoque: {
            where: { variacaoId: null },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!atual) {
        throw new Error("Produto não encontrado");
      }

      await tx.produto.update({
        where: { id },
        data: {
          nome: body.nome,
          descricao: body.descricao || null,
          preco: parseFloat(body.preco || 0),
          custoUnit: parseFloat(body.custoUnit || 0),
          categoria: body.categoria,
          unidade: body.unidade || "un",
          estoqueMin: parseInt(body.estoqueMin || 0),
        },
      });

      if (Array.isArray(body.imagens)) {
        await tx.produtoImagem.deleteMany({
          where: { produtoId: id },
        });

        if (imagensProduto.length) {
          await tx.produtoImagem.createMany({
            data: imagensProduto.map((img) => ({
              produtoId: id,
              url: img.url,
              fileKey: img.fileKey,
            })),
          });
        }
      }

      const variacaoIds = atual.variacoes.map((v) => v.id);

      if (variacaoIds.length) {
        await tx.estoque.deleteMany({
          where: {
            variacaoId: { in: variacaoIds },
          },
        });

        await tx.produtoVariacaoImagem.deleteMany({
          where: {
            variacaoId: { in: variacaoIds },
          },
        });

        await tx.produtoVariacao.deleteMany({
          where: {
            id: { in: variacaoIds },
          },
        });
      }

      if (variacoes.length) {
        await tx.estoque.deleteMany({
          where: {
            produtoId: id,
            variacaoId: null,
          },
        });

        for (const variacao of variacoes) {
          const imagensVariacao = normalizeImages(variacao.imagens || []);

          await tx.produtoVariacao.create({
            data: {
              produtoId: id,
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
                  produtoId: id,
                  quantidade: parseInt(variacao.quantidadeInicial || 0),
                  lote: variacao.lote || null,
                  localizacao: variacao.localizacao || null,
                  dataValidade: variacao.dataValidade
                    ? new Date(variacao.dataValidade)
                    : null,
                },
              },
            },
          });
        }
      } else {
        const estoquePrincipal = atual.estoque[0];

        if (estoquePrincipal) {
          await tx.estoque.update({
            where: { id: estoquePrincipal.id },
            data: {
              quantidade: parseInt(
                body.quantidadeInicial ?? estoquePrincipal.quantidade,
              ),
              lote: body.lote || null,
              localizacao: body.localizacao || null,
              dataValidade: body.dataValidade
                ? new Date(body.dataValidade)
                : null,
            },
          });
        } else {
          await tx.estoque.create({
            data: {
              produtoId: id,
              quantidade: parseInt(body.quantidadeInicial || 0),
              lote: body.lote || null,
              localizacao: body.localizacao || null,
              dataValidade: body.dataValidade
                ? new Date(body.dataValidade)
                : null,
            },
          });
        }
      }

      return tx.produto.findUnique({
        where: { id },
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
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 },
    );
  }
}
