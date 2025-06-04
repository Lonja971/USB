import { PlayerRepo } from "../../inMemoryRepos/player.js";
import { SpatialIndex } from "../map/SpatialIndex.js";
import { shipConfigs } from "../../config/game/shipConfigs.js";

export class BattleState {
   constructor({ id, config, teams, map }) {
      this.id = id;
      this.config = config;
      this.map = map;
      console.log(map);
      this.spatialIndex = new SpatialIndex();
      this.teams = teams;
      this.phase = "waiting";

      this.ships = {};
      this.projectiles = [];

      this.currentTurn = 0;
      this.playersWhoMoved = [];

      Object.entries(this.ships).forEach(([shipId, ship]) => {
         this.updateSpatialShipSegments(ship);
      });
   }
   
   updateSpatialShipSegments(ship) {
      for (const segment of ship.getSegments()) {
         this.spatialIndex.add(segment.x, segment.y, ship.id);
      }
   }

   getTeamShips(desiredTeamIndex){
      return Object.fromEntries(
         Object.entries(this.ships)
            .filter(([id, ship]) => ship.teamIndex === desiredTeamIndex)
      );
   }

   getState(playerId) {
      const playerTeamIndex = this.teams.findIndex(team =>
            team.some(player => player.id === playerId)
      );
      const playersTeamEntities = this.getTeamShips(playerTeamIndex);
      let teams = []
      this.teams.forEach(team => {
            const players = {}
            team.forEach(player => {
               const playerName = PlayerRepo.get(player.id).data.name;
               players[player.id] = { name: playerName };
            })
            teams.push(players);
      });
      return {
            teams: teams,
            playerTeamIndex: playerTeamIndex,
            phase: this.phase,
            currentTurn: this.currentTurn,
            ships: playersTeamEntities,
            mode: {
               name: this.config.modeName
            },
            map: {
               size: this.config.mapSize,
            }
      };
   }

   getBattleData(){
      return {
         phase: this.phase,
         currentTurn: this.currentTurn
      }
   }

   getMoveData(teamIndex){
      return {
         ships: this.getTeamShips(teamIndex)
      }
   }

   spawnShipsForTeams(teams, config) {
      const zones = [
         { xStart: 0, xEnd: this.map.width, yStart: 0, yEnd: Math.floor(this.map.height / 2) - 1 },
         { xStart: 0, xEnd: this.map.width, yStart: Math.ceil(this.map.height / 2), yEnd: this.map.height - 1 }
      ];

      teams.forEach((team, teamIndex) => {
         const spawnZone = zones[teamIndex];

         team.forEach(player => {
            player.ships = [];

            config.playerShips.forEach(({ type, count = 1 }, i) => {
               const shipConfig = shipConfigs[type];
               if (!shipConfig) return;

               for (let y = 0; y < count; y++) {
                  const shipId = `ship-${player.id}-${i}-${y}`;
                  const direction = "up";
                  const length = shipConfig.length;

                  const tempShip = new shipConfig.classRef({
                     id: shipId,
                     ownerId: player.id,
                     teamIndex,
                     direction,
                     health: shipConfig.health,
                     length,
                     availableSpeeds: shipConfig.availableSpeeds,
                     coreIndex: shipConfig.coreIndex,
                     weaponStrategy: new shipConfig.weapon.classRef()
                  });

                  const position = this.findFreePosition(tempShip, spawnZone);
                  if (position) {
                     tempShip.setPosition(position.x, position.y);
                     player.ships.push(tempShip);
                     this.ships[shipId] = tempShip;
                     this.updateSpatialShipSegments(tempShip);
                  } else {
                     console.warn(`Could not place ship ${shipId}`);
                  }
               }
            });
         });
      });
   }

   findFreePosition(ship, zone) {
      for (let y = zone.yStart; y <= zone.yEnd; y++) {
         for (let x = zone.xStart; x <= zone.xEnd; x++) {
            ship.setPosition(x, y);
            const segments = ship.getSegments();
            const canPlace = segments.every(seg =>
               this.map.isInside(seg.x, seg.y) &&
               !this.spatialIndex.isOccupied(seg.x, seg.y)
            );
            if (canPlace) return { x, y };
         }
      }
      return null;
   }
}