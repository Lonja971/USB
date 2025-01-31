import { Server } from "socket.io";
import { handlePlayerConnections } from "./sockets/playersSocket.js";
import { handleBattleEvents } from "./sockets/battleSocket.js";

export function initSocketServer(server) {
   const io = new Server(server, {
      cors: {
         origin: "*",
         methods: ["GET", "POST"],
      },
      pingInterval: 2000,
      pingTimeout: 5000
   });

   io.on("connection", (socket) => {
      handlePlayerConnections(io, socket);
      handleBattleEvents(io, socket);
   });
}