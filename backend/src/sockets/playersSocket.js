const backendPlayers = {};
let battleQueue  = [];

export function handlePlayerConnections(io, socket) {
   const backendPlayerId = socket.handshake.auth?.playerId;
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

   backendPlayers[backendPlayerId] = { socketId: socket.id, name: `${backendPlayerId} name` };

   function greeting() {
      socket.emit('playerData', { name: backendPlayers[backendPlayerId].name });
   }
   setTimeout(greeting, 1000);

   io.emit("updatePlayers", backendPlayers);

   socket.on("addToBattleQueue", (isInTurn) => {
      if (isInTurn){
         if (!battleQueue.includes(backendPlayerId)){
            battleQueue.push(backendPlayerId);
            socket.emit("isInBattleQueue", {
               status: true,
               playersNum: battleQueue.length
            });
         }
      }else{
         battleQueue = battleQueue.filter(id => id !== backendPlayerId);
         socket.emit("isInBattleQueue", {status: false});
      }
   });

   setInterval(() => {
      io.emit("getPlayersNumInQueue", battleQueue.length)
   },2500)

   socket.on("disconnect", (reason) => {
      console.log(`Player ${socket.id} disconnected: ${reason}`);
      delete backendPlayers[backendPlayerId];
      io.emit("updatePlayers", backendPlayers);
   });
}
