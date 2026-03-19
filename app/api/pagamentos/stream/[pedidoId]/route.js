import { paymentEvents } from "@/app/lib/paymentEvents";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(req, { params }) {
  const { pedidoId } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Não autenticado", { status: 401 });
  }

  if (session.user.role !== "admin") {
    const venda = await prisma.venda.findUnique({
      where: { id: pedidoId },
      select: {
        cliente: { select: { usuarioId: true } },
      },
    });

    if (!venda || venda.cliente?.usuarioId !== session.user.id) {
      return new Response("Acesso negado", { status: 403 });
    }
  }

  const stream = new ReadableStream({
    start(controller) {
      const send = (data) => {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`),
        );
      };

      const listener = (payload) => {
        if (payload.pedidoId === pedidoId) {
          send(payload);
        }
      };

      paymentEvents.on("payment", listener);

      req.signal.addEventListener("abort", () => {
        paymentEvents.off("payment", listener);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}
