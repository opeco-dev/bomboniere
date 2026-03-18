import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  const cliente = await prisma.cliente.findUnique({
    where: { id: params.id },
  });

  return NextResponse.json(cliente);
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();

  const usuario = await prisma.usuario.findUnique({
    where: { id: params.id },
    include: { cliente: true },
  });

  if (!usuario) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 },
    );
  }

  // 🔵 atualiza usuário
  await prisma.usuario.update({
    where: { id: params.id },
    data: {
      nome: body.nome,
      email: body.email,
      role: body.role,
    },
  });

  // 🟢 atualiza cliente se existir
  if (usuario.cliente) {
    await prisma.cliente.update({
      where: { id: usuario.cliente.id },
      data: {
        telefone: body.telefone,
        setor: body.setor,
        email: body.email,
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { cliente: true },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // 🔒 proteção: não deletar a si mesmo
    const session = await getServerSession(authOptions);
    if (session?.user?.id === id) {
      return NextResponse.json(
        { error: "Você não pode desativar a si mesmo" },
        { status: 400 },
      );
    }

    // 🔴 desativa usuário
    await prisma.usuario.update({
      where: { id },
      data: { ativo: false },
    });

    // 🟢 desativa cliente SE existir (com try safe)
    if (usuario.cliente?.id) {
      await prisma.cliente.updateMany({
        where: { id: usuario.cliente.id },
        data: { ativo: false },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao desativar usuário" },
      { status: 500 },
    );
  }
}
