import { Payment } from "mercadopago";
import client from "../../../lib/mercadopago";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      // #region agent log
      fetch('http://127.0.0.1:7887/ingest/83098060-f6a0-4f83-b310-6ca8f094a830',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3b194b'},body:JSON.stringify({sessionId:'3b194b',runId:'post-fix',hypothesisId:'H4',location:'app/api/pagamentos/pix/route.js:12',message:'pix_unauthorized',data:{},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();

    const venda = await prisma.venda.findUnique({
      where: { id: body.vendaId },
      include: {
        cliente: true,
      },
    });

    if (!venda) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 },
      );
    }

    if (session.user.role !== "admin" && venda.cliente?.usuarioId !== session.user.id) {
      // #region agent log
      fetch('http://127.0.0.1:7887/ingest/83098060-f6a0-4f83-b310-6ca8f094a830',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3b194b'},body:JSON.stringify({sessionId:'3b194b',runId:'post-fix',hypothesisId:'H4',location:'app/api/pagamentos/pix/route.js:36',message:'pix_forbidden_not_owner',data:{isAdmin:false,hasCliente:!!venda.cliente},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // expiração 10 minutos
    const expiration = new Date(Date.now() + 10 * 60 * 1000);

    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: Number(venda.total),
        description: `Pedido ${venda.id}`,
        payment_method_id: "pix",

        date_of_expiration: expiration.toISOString(),

        payer: {
          email: venda.cliente?.email || "cliente@email.com",
        },
      },
    });

    // salva pagamento no pedido
    await prisma.venda.update({
      where: { id: venda.id },
      data: {
        pagamentoId: String(result.id),
        pixExpiraEm: expiration,
      },
    });

    const pixData = result.point_of_interaction.transaction_data;

    return NextResponse.json({
      qrBase64: pixData.qr_code_base64,
      copiaCola: pixData.qr_code,
      link: pixData.ticket_url,
      expiraEm: expiration,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Erro gerar PIX" }, { status: 500 });
  }
}
