import { battleModes } from "../config/battleModes.js";
import { setPlayersForBattle } from "../functions/setPlayersForBattle.js";

let battleQueue = [];
const battleMode = battleModes["1v1_usual"]

export function handleBattleQueueConnections(io, socket, backendPlayerId, battles, backendPlayers) {
   socket.on("addToBattleQueue", (isInTurn) => {
      if (isInTurn) {
         if (!battleQueue.includes(backendPlayerId)) {
            battleQueue.push(backendPlayerId);
            socket.emit("isInBattleQueue", {
               status: true,
               playersNum: battleQueue.length
            });
         }
      } else {
         battleQueue = battleQueue.filter(id => id !== backendPlayerId);
         socket.emit("isInBattleQueue", { status: false });
      }
   });

   setInterval(() => {
      setPlayersForBattle(io, battleQueue, backendPlayers, battles, battleMode);
      io.emit("getPlayersNumInQueue", battleQueue.length);
   }, 2500);
}