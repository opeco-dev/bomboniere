import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      // #region agent log
      fetch('http://127.0.0.1:7887/ingest/83098060-f6a0-4f83-b310-6ca8f094a830', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '3b194b',
        },
        body: JSON.stringify({
          sessionId: '3b194b',
          runId: 'post-fix',
          hypothesisId: 'H6',
          location: 'app/api/pedidos/[id]/route.js:14',
          message: 'pedido_detail_unauthenticated',
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log

      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const isAdmin = session.user.role === "admin";
    const id = params.id;

    const pedidoBase = await prisma.venda.findUnique({
      where: { id },
      select: {
        cliente: { select: { usuarioId: true } },
      },
    });

    if (!pedidoBase) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const allowed = isAdmin || pedidoBase.cliente?.usuarioId === session.user.id;

    // #region agent log
    fetch('http://127.0.0.1:7887/ingest/83098060-f6a0-4f83-b310-6ca8f094a830', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '3b194b',
      },
      body: JSON.stringify({
        sessionId: '3b194b',
        runId: 'post-fix',
        hypothesisId: 'H6',
        location: 'app/api/pedidos/[id]/route.js:46',
        message: 'pedido_detail_authorization',
        data: { isAdmin, allowed },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    if (!allowed) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const pedido = await prisma.venda.findUnique({
      where: {
        id: params.id,
      },

      include: {
        itens: {
          include: {
            produto: true,
            variacao: true,
          },
        },
      },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Erro buscar pedido:", error);

    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
