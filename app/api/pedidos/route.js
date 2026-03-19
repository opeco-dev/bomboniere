import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const itens = body.itens || [];
  const status = body.status || "aberta";

  if (!itens.length) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const cliente = await prisma.cliente.findUnique({
    where: {
      usuarioId: session.user.id,
    },
  });

  if (!cliente) {
    return NextResponse.json(
      { error: "Cliente não encontrado" },
      { status: 404 },
    );
  }

  const total = itens.reduce(
    (sum, item) => sum + Number(item.preco || 0) * Number(item.quantidade || 0),
    0,
  );

  try {
    const venda = await prisma.$transaction(async (tx) => {
      const novaVenda = await tx.venda.create({
        data: {
          clienteId: cliente.id,
          total,
          status,
          itens: {
            create: itens.map((item) => ({
              produtoId: item.id,
              variacaoId: item.variacaoId || null,
              saborSnapshot: item.sabor || null,
              quantidade: Number(item.quantidade || 0),
              precoUnit: Number(item.preco || 0),
              subtotal: Number(item.preco || 0) * Number(item.quantidade || 0),
            })),
          },
        },
        include: {
          cliente: true,
          itens: {
            include: {
              produto: true,
              variacao: true,
            },
          },
        },
      });

      for (const item of itens) {
        if (item.variacaoId) {
          await tx.estoque.updateMany({
            where: {
              produtoId: item.id,
              variacaoId: item.variacaoId,
            },
            data: {
              quantidade: {
                decrement: Number(item.quantidade || 0),
              },
            },
          });
        } else {
          await tx.estoque.updateMany({
            where: {
              produtoId: item.id,
              variacaoId: null,
            },
            data: {
              quantidade: {
                decrement: Number(item.quantidade || 0),
              },
            },
          });
        }
      }

      return novaVenda;
    });

    return NextResponse.json(venda);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);

    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json([], { status: 401 });
  }

  const cliente = await prisma.cliente.findUnique({
    where: {
      usuarioId: session.user.id,
    },
  });

  if (!cliente) {
    return NextResponse.json([]);
  }

  const vendas = await prisma.venda.findMany({
    where: {
      clienteId: cliente.id,
      ativo: true,
    },
    include: {
      itens: {
        include: {
          produto: true,
          variacao: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(vendas);
}
