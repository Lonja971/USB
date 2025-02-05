import config from '../config/serverConfig.js';
import { getPlayerData } from '../models/playerModel.js';

export function handlePlayerConnections(io, socket, backendPlayerId, backendPlayers) {
   console.log(`User connected: ${socket.id} | ${backendPlayerId}`);

   function sendPlayerData() {
      socket.emit('playerData', backendPlayers[backendPlayerId].data);
   }

   //---ПЕРЕВІРКИ-НА-ВХІД---

   if (!backendPlayerId) {
      socket.emit("disconnectReason", "Немає backendPlayerId");
      socket.disconnect();
      return;
   }
   if (backendPlayers[backendPlayerId]) {
      socket.emit("disconnectReason", `Гравець ${backendPlayers[backendPlayerId].name} вже грає зараз. Спробуйте зайти в гру пізніше.`);
      socket.disconnect(true);
      console.log(`Player ${socket.id} disconnected (duplicate).`);
      return;
   }

   //---ЗБІР-ІНФОРМАЦІЇ-ПРО-ГРАВЦЯ---

   const fetchAndStorePlayer = async (playerId) => {
      try {
         const playerData = await getPlayerData(playerId);

         backendPlayers[backendPlayerId] = {
            socketId: socket.id,
            data: {
               id: playerData.id,
               name: playerData.name,
               gold: playerData.gold,
               silver: playerData.silver,
               currentBattleId: playerData.current_battle_id ? playerData.current_battle_id : null,
            }
         };
         console.log(backendPlayers[backendPlayerId]);
         setTimeout(sendPlayerData, 1000);
      } catch (error) {
         console.error('Error fetching player data:', error);
      }
   };
   fetchAndStorePlayer(backendPlayerId);

   //---ОНОВЛЕННЯ-КІЛЬКОСТІ-ГРАВЦІВ-В-МЕРЕЖІ---

   let intervalId = null;

   socket.on("subscribePlayersNumber", () => {
      if (!intervalId) {
         intervalId = setInterval(() => {
            const playersCount = Object.keys(backendPlayers).length;
            socket.emit("playersNumber", playersCount);
         }, config.SERVER_TICK);
      }
   });
   socket.on("unsubscribePlayersNumber", () => {
      if (intervalId) {
         clearInterval(intervalId);
         intervalId = null;
      }
   });

   socket.on("disconnect", (reason) => {
      console.log(`Player ${socket.id} disconnected: ${reason}`);
      delete backendPlayers[backendPlayerId];
   });
}
