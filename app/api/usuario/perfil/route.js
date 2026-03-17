import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { tipo, valor } = await req.json();

  try {
    if (tipo === "nome") {
      await prisma.usuario.update({
        where: { id: session.user.id },
        data: {
          nome: valor,
        },
      });
    }

    if (tipo === "email") {
      await prisma.usuario.update({
        where: { id: session.user.id },
        data: {
          email: valor,
        },
      });
    }

    if (tipo === "senha") {
      const hash = await bcrypt.hash(valor, 10);

      await prisma.usuario.update({
        where: { id: session.user.id },
        data: {
          senha: hash,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 },
    );
  }
}
