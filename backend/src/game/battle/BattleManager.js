import { BattleController } from "./BattleController.js";
import { BattleRepo } from "../../inMemoryRepos/battle.js";
import { shipConfigs } from "../../config/game/shipConfigs.js";
import { GameMap } from "../map/GameMap.js";

function createBattle(io, teams, modeConfig) {
   const battleId = `battle-${Date.now()}`;
   const map = new GameMap(modeConfig.mapSize.x, modeConfig.mapSize.y);

   const battle = new BattleController({
      io,
      id: battleId,
      map,
      teams,
      config: modeConfig
   });
   
   battle.state.spawnShipsForTeams(teams, modeConfig);
   BattleRepo.create(battleId, battle);
   return [battleId, battle];
}

function getBattle(id) {
   return BattleRepo.get(id);
}

function removeBattle(id) {
   BattleRepo.delete(id);
}

export {
   createBattle,
   getBattle,
   removeBattle,
};