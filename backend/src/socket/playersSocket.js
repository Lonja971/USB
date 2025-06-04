import config from '../config/serverConfig.js';
import { PlayerRepo } from '../inMemoryRepos/player.js';
import { battleQueue } from '../inMemoryRepos/battleQueue.js';
import { tryMatchPlayers } from '../matchmaker/matchmaker.js';
import { PlayerRepository } from "../repositories/playerRepository.js";
import { handleBattleEvents } from './battle.js';
import { BattleRepo } from '../inMemoryRepos/battle.js';
import { joinBattleRoom } from '../utils/battles/battle.js';

export function handlePlayerConnections(io, socket, backendPlayerId) {
   console.log(`User connected: ${socket.id} | ${backendPlayerId}`);

   if (!backendPlayerId) {
      socket.emit("disconnectReason", "Немає backendPlayerId");
      socket.disconnect();
      return;
   }

   const existing = PlayerRepo.get(backendPlayerId);
   if (existing) {
      socket.emit("disconnectReason", `Гравець ${existing.data.name} вже грає зараз. Спробуйте пізніше.`);
      socket.disconnect(true);
      return;
   }

   const fetchAndStorePlayer = async () => {
      try {
         const playerData = await PlayerRepository.getPlayerData(backendPlayerId);

         //--- Якщо користувач вже в битві ---
         if (playerData.current_battle_id) {
            const playerCurrentBattleId = playerData.current_battle_id;
            const battleInstance = BattleRepo.get(playerCurrentBattleId);

            if (!battleInstance) {
               PlayerRepository.deleteCurrentBattleId(backendPlayerId);
               playerData.current_battle_id = null;
            }
            else{
               joinBattleRoom(socket, backendPlayerId, playerCurrentBattleId, battleInstance.state.teams);
               handleBattleEvents(socket, playerCurrentBattleId, battleInstance, backendPlayerId);
            }

         }

         PlayerRepo.create(backendPlayerId, {
            socketId: socket.id,
            data: {
               id: playerData.id,
               name: playerData.name,
               gold: playerData.gold,
               silver: playerData.silver,
               currentBattleId: playerData.current_battle_id || null,
            },
         });

         const player = PlayerRepo.get(backendPlayerId);

         socket.emit("playerData", player.data);

         //--- ВІДСЛІДКОВУЄМО ---

         //--- Бій  ---
         socket.on("findBattle", () => {
            if (player.data.currentBattleId) {
               socket.emit("error", "You are already in a battle.");
               return;
            }

            if (battleQueue.has(backendPlayerId)) {
               socket.emit("info", "Already in queue");
               return;
            }

            battleQueue.set(backendPlayerId, socket);
            socket.emit("queueStatus", { status: "joined" });
            tryMatchPlayers(io);
         });

         socket.on("cancelBattleSearch", () => {
            if (!battleQueue.has(backendPlayerId)) {
               socket.emit("info", "Not in queue");
               return;
            }

            battleQueue.delete(backendPlayerId);
            socket.emit("queueStatus", { status: "left" });
         });

         //--- Гравці в мережі ---
         let intervalId = null;

         socket.on("subscribePlayersNumber", () => {
            if (!intervalId) {
               intervalId = setInterval(() => {
                  const playersCount = PlayerRepo.list().length;
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
            battleQueue.delete(backendPlayerId);
            PlayerRepo.remove(backendPlayerId);
         });
      } catch (error) {
         console.error("Error fetching player data:", error);
         socket.emit("disconnectReason", "Не вдалося завантажити гравця");
         socket.disconnect();
      }
   };

   fetchAndStorePlayer();
}