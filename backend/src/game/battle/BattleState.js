import { PlayerRepo } from "../../inMemoryRepos/player.js";
import { SpatialIndex } from "../map/SpatialIndex.js";
import { shipConfigs } from "../../config/game/shipConfigs.js";
import { serializeShip } from "../../services/shipSerializer.js";

export class BattleState {
   constructor({ id, config, teams, map }) {
      this.id = id;
      this.config = config;
      this.map = map;
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

   updateSpotting() {
      this.teams.forEach(team => {
         const spotted = team.spottedEntities;

         if (!spotted) return;

         for (const entityId in spotted) {
            spotted[entityId].duration--;

            if (spotted[entityId].duration <= 0) {
               delete spotted[entityId];
            }
         }
      });
   }

   getTeamShips(desiredTeamIndex){
      return Object.fromEntries(
         Object.entries(this.ships)
            .filter(([id, ship]) => ship.teamIndex === desiredTeamIndex)
      );
   }

   getSpottedEnemyShips(desiredTeamIndex) {
      const team = this.teams[desiredTeamIndex];
      const spotted = team?.spottedEntities;

      if (!spotted) return {};

      return Object.fromEntries(
         Object.entries(this.ships).filter(([id, ship]) =>
            ship.teamIndex !== desiredTeamIndex &&
            spotted[id]
         )
      );
   }

   getAllVisibleEntities(teamIndex, viewerId) {
      const teamShips = this.getTeamShips(teamIndex);
      const spottedEnemies = this.getSpottedEnemyShips(teamIndex);

      const serializeAndMap = (shipsObj) => {
         return Object.values(shipsObj).map(ship => serializeShip(ship, viewerId, teamIndex))
            .reduce((acc, ship) => {
            acc[ship.id] = ship;
            return acc;
            }, {});
      };

      return {
         ...serializeAndMap(teamShips),
         ...serializeAndMap(spottedEnemies),
      };
   }

   getState(playerId) {
      const playerTeamIndex = this.teams.findIndex(team =>
            team.some(player => player.id === playerId)
      );
      const playersTeamEntities = this.getAllVisibleEntities(playerTeamIndex, playerId);
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

   getMoveData(teamIndex, playerId){
      return {
         ships: this.getAllVisibleEntities(teamIndex, playerId)
      }
   }

   setSpottedEntity(entityId, spotDuration, teamIndex) {
      const team = this.teams[teamIndex];
      if (!team.spottedEntities) {
         team.spottedEntities = {};
      }
      team.spottedEntities[entityId] = {
         duration: spotDuration
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
                     speedsNullpoint: shipConfig.speedsNullpoint,
                     length,
                     availableSpeeds: shipConfig.availableSpeeds,
                     maneuverPoints: shipConfig.maneuverPoints,
                     maneuverCosts: shipConfig.maneuverCosts,
                     coreIndex: shipConfig.coreIndex,
                     configModules: shipConfig.modules,
                     configWeapons: shipConfig.weapons
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