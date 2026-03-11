import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export async function POST(req) {

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const itens = body.itens;

  if (!itens || itens.length === 0) {
    return NextResponse.json(
      { error: "Carrinho vazio" },
      { status: 400 }
    );
  }

  // buscar cliente do usuário logado
  const cliente = await prisma.cliente.findUnique({
    where: {
      usuarioId: session.user.id
    }
  });

  if (!cliente) {
    return NextResponse.json(
      { error: "Cliente não encontrado" },
      { status: 404 }
    );
  }

  // calcular total
  const total = itens.reduce(
    (sum, i) => sum + i.preco * i.quantidade,
    0
  );

  // criar venda
  const venda = await prisma.venda.create({
    data: {
      clienteId: cliente.id,
      total: total,
      status: "aberta",

      itens: {
        create: itens.map((i) => ({
          produtoId: i.id,
          quantidade: i.quantidade,
          precoUnit: i.preco,
          subtotal: i.preco * i.quantidade,
        })),
      },
    },

    include: {
      cliente: true,
      itens: {
        include: { produto: true },
      },
    },
  });

  // baixar estoque
  for (const item of itens) {
    await prisma.estoque.updateMany({
      where: { produtoId: item.id },
      data: {
        quantidade: {
          decrement: item.quantidade,
        },
      },
    });
  }

  return NextResponse.json(venda);

}

export async function GET() {

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json([], { status: 401 });
  }

  const cliente = await prisma.cliente.findUnique({
    where: {
      usuarioId: session.user.id
    }
  });

  if (!cliente) {
    return NextResponse.json([]);
  }

  const vendas = await prisma.venda.findMany({
    where: {
      clienteId: cliente.id
    },

    include: {
      itens: {
        include: {
          produto: true
        }
      }
    },

    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(vendas);

}