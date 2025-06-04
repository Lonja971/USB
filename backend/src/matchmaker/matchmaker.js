import { battleQueue } from "../inMemoryRepos/battleQueue.js";
import { PlayerRepo } from "../inMemoryRepos/player.js";
import { handleBattleEvents } from "../socket/battle.js";
import { PlayerRepository } from "../repositories/playerRepository.js";
import { createBattle } from "../game/battle/BattleManager.js";
import { battleModes } from "../config/game/battleModes.js";

export function tryMatchPlayers(io) {
   const mode = battleModes["1v1_usual"];
   const queue = Array.from(battleQueue.entries());

   const totalPlayersNeeded = mode.teams * mode.playersInTeam;

   while (queue.length >= totalPlayersNeeded) {
      const selectedPlayers = [];
   
      for (let i = 0; i < totalPlayersNeeded; i++) {
         selectedPlayers.push(queue.shift());
      }
   
      const teams = [];
      for (let i = 0; i < mode.teams; i++) {
         const team = [];
            for (let j = 0; j < mode.playersInTeam; j++) {
               const [id, socket] = selectedPlayers[i * mode.playersInTeam + j];
               team.push({ id, socket });
            }
            teams.push(team);
         }
   
      const [battleId, battleInstance] = createBattle(io, teams, mode);
   
      teams.flat().forEach(({ id, socket }) => {
         PlayerRepo.get(id).data.currentBattleId = battleId;
         PlayerRepository.updateCurrentBattleId(id, battleId);
      });
   
      teams.forEach((team, teamIndex) => {
         team.forEach(({ id, socket }) => {
            socket.join(battleId);
            socket.join(`${battleId}_team_${teamIndex}`);

            const opponents = teams.flat().filter(p => p.id !== id).map(p => p.id);
            socket.emit("BattleFound", {
               battleId,
               team: teamIndex,
               opponents
            });
            handleBattleEvents(socket, battleId, battleInstance, id);
         });
      });
   }
}