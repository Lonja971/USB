import { Server } from "socket.io";
import { handlePlayerConnections } from "./socket/playersSocket.js";
import config from './config/serverConfig.js';
import { getPlayerId } from "./repositories/tokensModel.js";

export function initSocketHandler(server) {
   const io = new Server(server, {
      cors: {
         origin: config.CORS_ORIGIN,
         methods: ["GET", "POST"],
      },
      pingInterval: config.SOCKET_OPTIONS.pingInterval,
      pingTimeout: config.SOCKET_OPTIONS.pingTimeout
   });

   io.on("connection", async (socket) => {
      try {
         const playerIdInfo = await getPlayerId(socket.handshake.auth?.playerToken);
         if (!playerIdInfo.isSuccess) {
            const reason = playerIdInfo.message || 'Authentication failed';
            socket.emit("disconnectReason", reason);
            socket.disconnect();
            return;
         }
         const backendPlayerId = playerIdInfo.id;

         handlePlayerConnections(socket, backendPlayerId);
      } catch (error) {
         console.error('Error fetching player data:', error);
      }
   });
}