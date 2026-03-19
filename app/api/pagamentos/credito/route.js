import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // #region agent log
    fetch('http://127.0.0.1:7887/ingest/83098060-f6a0-4f83-b310-6ca8f094a830',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3b194b'},body:JSON.stringify({sessionId:'3b194b',runId:'post-fix',hypothesisId:'H5',location:'app/api/pagamentos/credito/route.js:7',message:'credito_unauthorized',data:{},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();

  const venda = await prisma.venda.findUnique({
    where: { id: body.vendaId },
    include: { cliente: true },
  });

  if (!venda) {
    return NextResponse.json(
      { error: "Venda não encontrada" },
      { status: 404 },
    );
  }

  if (session.user.role !== "admin" && venda.cliente?.usuarioId !== session.user.id) {
    // #region agent log
    fetch('http://127.0.0.1:7887/ingest/83098060-f6a0-4f83-b310-6ca8f094a830',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3b194b'},body:JSON.stringify({sessionId:'3b194b',runId:'post-fix',hypothesisId:'H5',location:'app/api/pagamentos/credito/route.js:27',message:'credito_forbidden_not_owner',data:{isAdmin:false,hasCliente:!!venda.cliente},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  await prisma.contaReceber.create({
    data: {
      vendaId: venda.id,
      clienteId: venda.clienteId,

      valorTotal: venda.total,
      saldo: venda.total,

      parcelas: {
        create: [
          {
            numeroParcela: 1,
            valor: venda.total,
            dataVencimento: new Date(),
          },
        ],
      },
    },
  });

  await prisma.venda.update({
    where: { id: venda.id },
    data: {
      status: "finalizada",
    },
  });

  return NextResponse.json({ ok: true });
}
