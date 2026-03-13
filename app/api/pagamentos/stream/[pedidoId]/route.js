import { paymentEvents } from "@/app/lib/paymentEvents";

export async function GET(req, { params }) {
  const { pedidoId } = params;

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
