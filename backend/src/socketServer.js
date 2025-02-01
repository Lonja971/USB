import { Server } from "socket.io";
import { handlePlayerConnections } from "./sockets/playersSocket.js";
import { handleBattleEvents } from "./sockets/battleSocket.js";
import { handleBattleQueueConnections } from "./sockets/battleQueueSocket.js";
import config from './config/serverConfig.js';

export function initSocketServer(server) {
   const io = new Server(server, {
      cors: {
         origin: config.CORS_ORIGIN,
         methods: ["GET", "POST"],
      },
      pingInterval: config.SOCKET_OPTIONS.pingInterval,
      pingTimeout: config.SOCKET_OPTIONS.pingTimeout
   });

   const backendPlayers = {};
   const battles = {};

   io.on("connection", (socket) => {
      const backendPlayerId = socket.handshake.auth?.playerId;

      handlePlayerConnections(io, socket, backendPlayerId, backendPlayers);
      handleBattleQueueConnections(io, socket, backendPlayerId, battles, backendPlayers);
      handleBattleEvents(io, socket, backendPlayers);

      setInterval(() => {
         console.log(backendPlayers);
         console.log(battles);
      }, 2500)
   });
}