import { Server } from "socket.io";

let io;

export function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("cliente conectado", socket.id);

      socket.on("join-pedido", (pedidoId) => {
        socket.join(pedidoId);
      });
    });
  }

  return io;
}

export function getIO() {
  return io;
}
