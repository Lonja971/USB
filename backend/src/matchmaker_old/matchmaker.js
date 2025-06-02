import { battleModes } from "../config/battleModes.js";
import { processBattleQueue } from "./processBattleQueue.js";

let battleQueues = {};
let battleQueuesStatus = {};

export function matchmaker(io, socket, backendPlayerId, battles, backendPlayers) {
   socket.on("addToBattleQueue", ({ playerBattleMode, isInTurn }) => {

      if (!battleModes[playerBattleMode]?.isActive) {
         console.log(`Режим "${playerBattleMode}" не активний чи не існує.`);
         socket.emit("isInBattleQueue", {
            status: false,
            message: `Режим "${playerBattleMode}" не активний чи не існує.`
         });
         return;
      }

      for (const mode in battleQueues) {
         if (battleQueues[mode].includes(backendPlayerId)) {
            battleQueues[mode] = battleQueues[mode].filter(id => id !== backendPlayerId);
            console.log(`Гравець ${backendPlayerId} видалений з черги "${mode}"`);
         }
      }

      if (!battleQueues[playerBattleMode]) {
         battleQueues[playerBattleMode] = [];
      }

      if (isInTurn) {
         if (!battleQueues[playerBattleMode].includes(backendPlayerId)) {
            battleQueues[playerBattleMode].push(backendPlayerId);
            socket.emit("isInBattleQueue", { status: true });

            if (!battleQueuesStatus[playerBattleMode]) {
               battleQueuesStatus[playerBattleMode] = { isWorking: false, isNeedToRepeat: false };
            }

            if (battleQueuesStatus[playerBattleMode].isWorking) {
               battleQueuesStatus[playerBattleMode].isNeedToRepeat = true;
            } else {
               processBattleQueue(playerBattleMode, io, backendPlayers, battles);
            }
         } else {
            socket.emit("isInBattleQueue", {
               status: true,
               message: "Гравець вже в черзі!"
            });
         }
      } else {
         battleQueues[playerBattleMode] = battleQueues[playerBattleMode].filter(id => id !== backendPlayerId);
         socket.emit("isInBattleQueue", { status: false });
      }
   });
}
