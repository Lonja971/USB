import { PlayerRepo } from "../../inMemoryRepos/player.js";
import { SpatialIndex } from "../map/SpatialIndex.js";
import { shipConfigs } from "../../config/game/shipConfigs.js";
import { projectileTypes } from "../../config/game/projectileTypes.js";
import { serializeEntity } from "../../services/index.js";

export class BattleState {
   constructor({ id, config, teams, map }) {
      this.id = id;
      this.config = config;
      this.map = map;
      this.spatialIndex = new SpatialIndex();
      this.teams = teams;
      this.phase = "waiting";
      this.logic = null;

      this.entities = {};
      this.projectileIdCounter = 0;
      this.projectiles = new Map();

      this.currentTurn = 0;
      this.playersWhoMoved = [];

      Object.entries(this.entities).forEach(([entityId, entity]) => {
         if (entity.type === "ship"){
            this.updateSpatialShipSegments(entity);
         }
      });
   }
   
   updateSpatialProjectile(projectileId, projectile){
      this.spatialIndex.add(projectile.position.x, projectile.position.y, projectileId);
   }

   updateSpatialShipSegments(ship) {
      for (const segment of ship.getSegments()) {
         this.spatialIndex.add(segment.x, segment.y, ship.id);
      }
   }

   tick(teamIndex) {
      this._updateSpotting(teamIndex);
      this._updateProjectiles(teamIndex);
   }

   _updateSpotting(teamIndex) {
      for (let teamId = 0; teamId < this.teams.length; teamId++) {
         if (teamIndex !== "all" && teamId !== teamIndex) continue;

         const spotted = this.teams[teamId].spottedEntities;
         if (!spotted) continue;
   
         for (const entityId in spotted) {
            spotted[entityId].duration--;
   
            if (spotted[entityId].duration <= 0) {
               delete spotted[entityId];
            }
         }
      };
   }

   _updateProjectiles(teamIndex) {
      for (const [projectileId, projectile] of this.projectiles.entries()) {
         if (teamIndex !== "all" && projectile.teamIndex !== teamIndex) continue;
         console.log("оновлюємо снаряд: " + projectileId);
         projectile.tick();

         if (projectile.status.isAttacking) {
            this.logic.handleHit(projectileId);
         }

         if (projectile.status.isDestroyed) {
            this.removeProjectile(projectileId);
         }else {
            this.updateSpatialProjectile(projectileId, projectile);
         }
      }
   }

   getTeamEntities(desiredTeamIndex){
      return Object.fromEntries(
         Object.entries(this.entities)
            .filter(([id, entity]) => entity.teamIndex === desiredTeamIndex)
      );
   }

   getSpottedEnemyEntities(desiredTeamIndex) {
      const team = this.teams[desiredTeamIndex];
      const spotted = team?.spottedEntities;

      if (!spotted) return {};

      return Object.fromEntries(
         Object.entries(this.entities).filter(([entityId, entity]) =>
            entity.teamIndex !== desiredTeamIndex &&
            spotted[entityId]
         )
      );
   }

   getAllVisibleEntities(teamIndex, viewerId) {
      const teamEntities = this.getTeamEntities(teamIndex);
      const spottedEnemies = this.getSpottedEnemyEntities(teamIndex);

      const serializeAndMap = (entitiesObj) => {
         return Object.values(entitiesObj)
            .map(entity => serializeEntity(entity, viewerId, teamIndex))
            .filter(Boolean)
            .reduce((acc, serialized) => {
               acc[serialized.id] = serialized;
               return acc;
            }, {});
      };

      return {
         ...serializeAndMap(teamEntities),
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

   createProjectile(projectileData) {
      console.log("Ствоюємо снаряд в State");
      if (!projectileData.type) return;
      console.log("Ствоюємо снаряд в State");
      const projectileId = `${projectileData.type}-${projectileData.ownerId ? projectileData.ownerId : "unc"}-${this.projectileIdCounter++}`;
      projectileData.id = projectileId;

      const projectile = new projectileTypes[projectileData.type](projectileData);
      this.projectiles.set(projectileId, projectile);

      console.log("Створено снаряд:");
      console.log(projectile);
      return projectile;
   }

   removeProjectile(projectileId) {
      if (!this.projectiles.has(projectileId)) return;

      this.projectiles.delete(projectileId);
      this.spatialIndex.clearByEntityId(projectileId);
      console.log("Снаряд існує в projectiles:", this.projectiles.has(projectileId));
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
                     name: shipConfig.name,
                     ownerId: player.id,
                     teamIndex,
                     direction,
                     health: shipConfig.health,
                     speedsNullPointIndex: shipConfig.speedsNullPointIndex,
                     length,
                     availableSpeeds: shipConfig.availableSpeeds,
                     maneuverPoints: shipConfig.maneuverPoints,
                     maneuverCosts: shipConfig.maneuverCosts,
                     coreIndex: shipConfig.coreIndex,
                     detectionRadius: shipConfig.detectionRadius,
                     configModules: shipConfig.modules,
                     configWeapons: shipConfig.weapons
                  });

                  const position = this.findFreePosition(tempShip, spawnZone);
                  if (position) {
                     tempShip.setPosition(position.x, position.y);
                     player.ships.push(tempShip);
                     this.entities[shipId] = tempShip;
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