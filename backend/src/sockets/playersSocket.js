import config from '../config/serverConfig.js';

export function handlePlayerConnections(io, socket, backendPlayerId, backendPlayers) {
   console.log(`User connected: ${socket.id} | ${backendPlayerId}`);

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

   //---Збір-інформації-про-гравця---

   backendPlayers[backendPlayerId] = { socketId: socket.id, name: `${backendPlayerId} name`, inBattle: false };

   function greeting() {
      socket.emit('playerData', { name: backendPlayers[backendPlayerId].name });
   }
   setTimeout(greeting, 1000);

   io.emit("updatePlayers", backendPlayers);

   socket.on("getPlayerData", () => {
      greeting();
   });

   //---Оновлення-кількості-гравців-в-мережі---

   let intervalId = null;

   socket.on("subscribePlayersNumber", () => {
      if (!intervalId) {
         intervalId = setInterval(() => {
            const playersCount = Object.keys(backendPlayers).length;
            socket.emit("playersNumber", playersCount);
            console.log("Updated");
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
      io.emit("updatePlayers", backendPlayers);
   });
}
