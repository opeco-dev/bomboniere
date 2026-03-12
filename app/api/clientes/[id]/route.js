import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {

  const cliente = await prisma.cliente.findUnique({
    where: { id: params.id }
  });

  return NextResponse.json(cliente);
}

export async function PUT(req, { params }) {

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();

  const cliente = await prisma.cliente.update({
    where: { id: params.id },
    data: {
      nome: body.nome,
      telefone: body.telefone,
      email: body.email,
      setor: body.setor,
      limiteCredito: body.limiteCredito
    }
  });

  return NextResponse.json(cliente);
}

export async function DELETE(req, { params }) {

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const cliente = await prisma.cliente.update({
    where: { id: params.id },
    data: {
      ativo: false
    }
  });

  return NextResponse.json(cliente);
}