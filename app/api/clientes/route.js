import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    where: { ativo: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clientes);
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await req.json();

    const senhaHash = await bcrypt.hash(body.senha, 10);

    // cria usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome: body.nome,
        email: body.email,
        senha: senhaHash,
        role: "cliente",
      },
    });

    // cria cliente
    const cliente = await prisma.cliente.create({
      data: {
        usuarioId: usuario.id,
        nome: body.nome,
        telefone: body.telefone,
        email: body.email,
        setor: body.setor,
        limiteCredito: 1000,
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 },
    );
  }
}
