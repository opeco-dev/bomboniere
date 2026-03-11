import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const itens = body.itens;

  
  // buscar cliente do usuario
  const cliente = await prisma.cliente.findUnique({
    where: {
      usuarioId: session.user.id,
    },
  });

  if (!cliente) {
    return NextResponse.json({
      error: "Cliente não encontrado",
    });
  }

  const total = itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);

  const venda = await prisma.venda.create({
    data: {
      clienteId: cliente.id,

      total,

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

  const vendas = await prisma.venda.findMany({
    include: {
      cliente: true,
      itens: {
        include: { produto: true }
      }
    }
  })

  return NextResponse.json(vendas)

}
