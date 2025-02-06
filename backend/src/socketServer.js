import { Server } from "socket.io";
import { handlePlayerConnections } from "./sockets/playersSocket.js";
import { handleBattleEvents } from "./sockets/battleSocket.js";
import { handleBattleQueueConnections } from "./sockets/battleQueueSocket.js";
import config from './config/serverConfig.js';
import { getPlayerId } from "./models/tokensModel.js";

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

   io.on("connection", async (socket) => {
      try {
         const playerIdInfo = await getPlayerId(socket.handshake.auth?.playerToken);
         if (!playerIdInfo.isSuccess){
            playerIdInfo.message ? socket.emit("disconnectReason", playerIdInfo.message) : "";
            socket.disconnect();
            return;
         }
         const backendPlayerId = playerIdInfo.id;
   
         handlePlayerConnections(io, socket, backendPlayerId, backendPlayers);
         handleBattleQueueConnections(io, socket, backendPlayerId, battles, backendPlayers);
         handleBattleEvents(io, socket, backendPlayers);
      } catch (error) {
         console.error('Error fetching player data:', error);
      }
   });   
}