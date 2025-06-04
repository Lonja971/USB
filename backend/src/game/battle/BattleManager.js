import { BattleController } from "./BattleController.js";
import { BattleRepo } from "../../inMemoryRepos/battle.js";
import { shipConfigs } from "../../config/game/shipConfigs.js";
import { GameMap } from "../map/GameMap.js";

function createBattle(io, teams, modeConfig) {
   const battleId = `battle-${Date.now()}`;
   const map = new GameMap(modeConfig.mapSize.x, modeConfig.mapSize.y);
   const ships = {};
   const zones = [
      { xStart: 0, xEnd: map.width, yStart: 0, yEnd: Math.floor(map.height / 2) - 1 },
      { xStart: 0, xEnd: map.width, yStart: Math.ceil(map.height / 2), yEnd: map.height - 1 },
   ];

   teams.forEach((team, teamIndex) => {
      const spawnZone = zones[teamIndex];
      team.forEach(player => {
         player.ships = [];
         for (let i = 0; i < modeConfig.playerShips.length; i++) {
            const type = modeConfig.playerShips[i].type;
            const count = modeConfig.playerShips[i].count ?? 1;

            const shipConfig = shipConfigs[type];
            if (!shipConfig) {
               console.warn(`Unknown ship type: ${type}`);
               continue;
            }

            for (let y = 0; y < count; y++) {
               const shipId = `ship-${player.id}-${i}-${y}`;
               const direction = "up";
               const length = shipConfig.length;
               const coreIndex = shipConfig.corePosition ?? Math.floor(length / 2);
               let placed = false;

               for (let posY = spawnZone.yStart; posY <= spawnZone.yEnd && !placed; posY++) {
                  for (let posX = spawnZone.xStart; posX <= spawnZone.xEnd - length; posX++) {
                     const tempShip = new shipConfig.classRef({
                        id: shipId,
                        ownerId: player.id,
                        teamIndex,
                        x: posX,
                        y: posY,
                        direction,
                        health: shipConfig.health,
                        length,
                        availableSpeeds: shipConfig.availableSpeeds,
                        coreIndex: coreIndex,
                        weaponStrategy: new shipConfig.weapon.classRef()
                     });

                     const parts = tempShip.getSegments();
                     const collision = parts.some(part =>
                        Object.values(ships).some(e => e.getSegments().some(ep =>
                           ep.x === part.x && ep.y === part.y
                        ))
                     );

                     if (!collision) {
                        player.ships.push(tempShip);
                        ships[shipId] = tempShip;
                        placed = true;
                        break;
                     }
                  }
               }
               if (!placed) {
                  console.warn(`Could not place ship ${shipId}`);
               }
            }
         }
      });
   });

   const battle = new BattleController({
      io,
      id: battleId,
      map,
      teams,
      config: modeConfig,
      ships
   });

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